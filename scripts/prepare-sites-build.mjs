import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";

await rm("dist/client/media/personality-map-source.png", { force: true });

await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");

const worker = `async function withSiteOrigin(response, request) {
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;

  const html = await response.text();
  const origin = new URL(request.url).origin;
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(html.replaceAll("__SITE_ORIGIN__", origin), {
    status: response.status,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== "GET") {
      return withSiteOrigin(response, request);
    }

    const accept = request.headers.get("accept") || "";
    if (!accept.includes("text/html")) return response;

    const url = new URL(request.url);
    url.pathname = "/index.html";
    const fallback = await env.ASSETS.fetch(new Request(url, request));
    return withSiteOrigin(fallback, request);
  },
};
`;

await writeFile("dist/server/index.js", worker);
