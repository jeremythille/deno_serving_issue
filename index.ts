import { router } from "./router.ts"

const port = 8090;

const server: Deno.Listener = await Deno.listen({ port });
console.log(`Deno server listening on http://localhost:${port}/`);

/*
  CONNEXIONS HANDLER (async iterator)
*/

for await (const conn: Deno.Conn of server) {

  const httpConn = Deno.serveHttp(conn);

  for await (const { request:req, respondWith:res } of httpConn) {
    const response: Promise<Response> = router(req);
    res(response); // The only place where we respond to the browser
  }
}
