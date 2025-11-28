import Head from "next/head";

import TodoForm from "~/components/TodoForm";
import Todos from "~/components/Todos";

export default function Home() {
  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta
          name="description"
          content="Manage your tasks with a tiny todo list."
        />
        <link rel="icon" href="/favicon.ico" />
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </Head>
      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Todos form={<TodoForm />} />
      </main>
    </>
  );
}
