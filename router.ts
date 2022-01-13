import { dirname, fromFileUrl, resolve } from "https://deno.land/std@0.119.0/path/mod.ts";
const __dirname = dirname(fromFileUrl(import.meta.url));
const distDir = resolve(__dirname + "./dist");
console.log(`index - distDir = `, distDir)


export const router = async (req: Request): Promise<Response> => {

  await ""; // Just so Typescript stops complaining an async function has no await. I'm only using it to implicitly return a Promise
  const url = new URL(req.url); // url.pathname --> "/styles.css", "/assets/brain_128x128.png" etc.

  if ([".js", ".css", ".png", ".jpg"].some(ext => url.pathname.endsWith(ext))) {
    return serveFile(url.pathname);
  }

  switch (url.pathname) { 
    case "/": {
      return serveFile("index.html");
    }
  }

  const message = `Router - Dunno what to do with ${url.pathname}`
  console.log(message)
  return new Response(message)
}

const contentTypes: { [key: string]: string } = {
  js: "text/javascript",
  html: "text/html; charset=utf-8",
  css: "text/css",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml"
}

const serveFile = async (fileName: string): Promise<Response> => {

  const ext: string = fileName.split(".").pop() as string,
    contentType: string = contentTypes[ext];

  if (!contentType) {
    const message = `Dunno what content-type matches ${fileName}`
    console.log(message)
    return new Response(message)
  }

  console.log(`Serving file '${fileName}'`)
  const file = await Deno.readFile(distDir + "/" + fileName);

  return new Response(file, {
    headers: { "content-type": contentType }
  });
}