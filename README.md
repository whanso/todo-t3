# Welcome! Isak's Network Optimized Todo List

## Features

1. Optimized Real Time Sync Behavior
   - Enabled using minimal helper method that combines event emitter listeners.
   - The result: single SSE connection to handle multiple event types in a reducer-like fashion.
2. Optional re-render debugging with React Scan.
   - An excellent tool for performance optimization. As evidenced using the tool, multiple improvements can be made by securing referential equality and/or leveraging props or children to bypass unnecessary re-renders.

   Example:

   ```jsx
   <Todos items={<TodoItems />} />
   ```

   or

   ```jsx
   <Todos>
     <TodoItems />
   </Todos>
   ```

3. Minor style improvements.

## Development Setup

Using `node v20` and `docker`:

0. `docker compose up -d`
1. `npm i`
2. `npx prisma migrate dev`
3. `npm run dev`
