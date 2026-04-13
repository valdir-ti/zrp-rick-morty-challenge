import axios from "axios";
import type { Request, Response } from "express";

const EXTERNAL_BASE = "https://rickandmortyapi.com/api/character/avatar";
const MAX_CONCURRENT = 2;
const MAX_RETRIES = 5;
const RETRY_BASE_MS = 1000;

const cache = new Map<string, Buffer>();
const inflight = new Map<string, Promise<Buffer>>();

let activeRequests = 0;
const waitQueue: Array<() => void> = [];

function acquire(): Promise<void> {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests++;
    return Promise.resolve();
  }
  return new Promise((resolve) => waitQueue.push(resolve));
}

function release(): void {
  const next = waitQueue.shift();
  if (next) {
    next();
  } else {
    activeRequests--;
  }
}

async function fetchWithRetry(id: string): Promise<Buffer> {
  await acquire();
  try {
    let lastError: unknown;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await axios.get<ArrayBuffer>(
          `${EXTERNAL_BASE}/${id}.jpeg`,
          { responseType: "arraybuffer" },
        );
        return Buffer.from(response.data);
      } catch (err) {
        lastError = err;
        if (axios.isAxiosError(err) && err.response?.status === 429) {
          const jitter = Math.random() * RETRY_BASE_MS;
          await new Promise((r) =>
            setTimeout(r, RETRY_BASE_MS * Math.pow(2, attempt) + jitter),
          );
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  } finally {
    release();
  }
}

export class ImageProxyController {
  prefetch(ids: string[]): void {
    for (const id of ids) {
      if (cache.has(id) || inflight.has(id)) continue;
      const pending = fetchWithRetry(id).then(
        (buf) => {
          cache.set(id, buf);
          inflight.delete(id);
          return buf;
        },
        () => {
          inflight.delete(id);
        },
      );
      inflight.set(id, pending as Promise<Buffer>);
    }
  }

  async proxy(req: Request, res: Response): Promise<void> {
    const id = String(req.params["id"]);

    const cached = cache.get(id);
    if (cached) {
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(cached);
      return;
    }

    let pending = inflight.get(id);
    if (!pending) {
      pending = fetchWithRetry(id).then(
        (buf) => {
          cache.set(id, buf);
          inflight.delete(id);
          return buf;
        },
        (err) => {
          inflight.delete(id);
          throw err;
        },
      );
      inflight.set(id, pending);
    }

    try {
      const buf = await pending;
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(buf);
    } catch {
      res.status(502).json({ error: "Failed to fetch image" });
    }
  }
}
