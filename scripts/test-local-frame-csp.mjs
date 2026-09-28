import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

const { webkit } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const root = fileURLToPath(new URL("../", import.meta.url));
const before =
	"default-src 'self'; connect-src 'self' ipc: http://ipc.localhost";
const after = JSON.parse(
	readFileSync(`${root}/apps/desktop/src-tauri/tauri.conf.json`, "utf8"),
).app.security.csp;
const server = createServer();
server.on("upgrade", (req, socket) => {
	const accept = createHash("sha1")
		.update(
			`${req.headers["sec-websocket-key"]}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`,
		)
		.digest("base64");
	socket.write(
		`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`,
	);
	const frame = Buffer.from("local-video-frame");
	socket.write(Buffer.concat([Buffer.from([0x81, frame.length]), frame]));
	socket.on("data", () => socket.end());
	socket.on("error", () => {});
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const browser = await webkit.launch({ headless: true });
async function probe(policy, url) {
	const page = await browser.newPage();
	await page.route("http://127.0.0.1:65530/**", (route) =>
		route.fulfill({
			contentType: "text/html",
			headers: { "Content-Security-Policy": policy },
			body: "<!doctype html><title>Local transport regression</title>",
		}),
	);
	await page.goto("http://127.0.0.1:65530/");
	const result = await page.evaluate(
		(url) =>
			new Promise((resolve) => {
				const timeout = setTimeout(() => resolve("timeout"), 3000);
				function finish(value) {
					clearTimeout(timeout);
					resolve(value);
				}
				document.addEventListener(
					"securitypolicyviolation",
					(e) => finish(`blocked:${e.violatedDirective}`),
					{ once: true },
				);
				try {
					const socket = new WebSocket(url);
					socket.onmessage = (e) => {
						finish(e.data);
						socket.close();
					};
					socket.onerror = () =>
						setTimeout(() => finish("connection-error"), 100);
				} catch (e) {
					finish(e.name);
				}
			}),
		url,
	);
	await page.close();
	return result;
}
try {
	for (const host of ["localhost", "127.0.0.1"]) {
		const previous = await probe(before, `ws://${host}:${port}`);
		assert.match(previous, /blocked:connect-src|SecurityError/);
		const fixed = await probe(after, `ws://${host}:${port}`);
		assert.equal(fixed, "local-video-frame");
		console.log(
			`${host}: reproduced ${previous}; fixed policy received video frame`,
		);
	}
	const remote = await probe(after, "ws://example.invalid:12345");
	assert.match(remote, /blocked:connect-src|SecurityError/);
	console.log("External WebSocket remains blocked");
} finally {
	await browser.close();
	await new Promise((resolve) => server.close(resolve));
}
