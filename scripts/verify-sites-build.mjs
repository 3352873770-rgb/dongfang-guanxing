import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("verify", Date.now().toString());
const { default: worker } = await import(workerUrl.href);

const assets = {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    try {
      const body = await readFile(new URL(`../dist/client${pathname}`, import.meta.url));
      const headers = pathname.endsWith(".html") ? { "content-type": "text/html; charset=utf-8" } : {};
      return new Response(body, { status: 200, headers });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  },
};

const response = await worker.fetch(new Request("https://preview.example/"), { ASSETS: assets });
assert.equal(response.status, 200);
const html = await response.text();
assert.match(html, /<title>东方观星｜东方易理 · 一事一问<\/title>/);
assert.match(html, /https:\/\/dongfang-guanxing\.dainty-lemon-8005\.chatgpt\.site\/og\.png/);
assert.doesNotMatch(html, /__SITE_ORIGIN__/);
console.log("Sites build verified");
