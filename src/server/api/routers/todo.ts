import { tracked } from "@trpc/server";
import { on } from "events";
import type { Todo } from "generated/prisma";
import { EventEmitter } from "stream";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type EventMap<T> = Record<keyof T, any[]>;
class IterableEventEmitter<T extends EventMap<T>> extends EventEmitter<T> {
  toIterable<TEventName extends keyof T & string>(
    eventName: TEventName,
    opts?: NonNullable<Parameters<typeof on>[2]>,
  ): AsyncIterable<T[TEventName]> {
    return on(this as any, eventName, opts) as any;
  }
}

export interface MyEvents {
  add: [data: Todo];
  remove: [id: number];
}

export const ee = new IterableEventEmitter<MyEvents>();

export const todoRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Please enter a task title."),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.db.todo.create({
        data: {
          title: input.title,
        },
      });
      ee.emit("add", todo);
      return todo;
    }),

  toggle: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        completed: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.update({
        where: { id: input.id },
        data: { completed: input.completed },
      });
    }),

  remove: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.todo.delete({
        where: { id: input.id },
      });
      ee.emit("remove", input.id);
      return { id: input.id };
    }),
  onTodoAdd: publicProcedure.subscription(async function* (opts) {
    // listen for new events
    for await (const [data] of on(ee, "add", {
      // Passing the AbortSignal from the request automatically cancels the event emitter when the request is aborted
      signal: opts.signal,
    })) {
      const post = data as Todo;
      yield tracked(post.id.toString(), post);
    }
  }),
  onTodoRemove: publicProcedure.subscription(async function* (opts) {
    // listen for new events
    for await (const [data] of on(ee, "remove", {
      // Passing the AbortSignal from the request automatically cancels the event emitter when the request is aborted
      signal: opts.signal,
    })) {
      const todoId = data as number;
      yield tracked(data.toString(), todoId);
    }
  }),
});
