import axios from "axios";
import type { Request, Response } from "express";
import { ImageProxyController } from "./ImageProxyController";

jest.mock("axios");
const mockedGet = axios.get as jest.Mock;

function makeRes() {
  const res = {
    setHeader: jest.fn(),
    send: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  return res;
}

function makeReq(id: string) {
  return { params: { id } } as unknown as Request;
}

describe("ImageProxyController", () => {
  let controller: ImageProxyController;

  beforeEach(() => {
    controller = new ImageProxyController();
    jest.clearAllMocks();
    // jest.mock("axios") auto-mocks isAxiosError — restore real behaviour
    (axios.isAxiosError as unknown as jest.Mock).mockImplementation(
      (err: unknown) => !!(err as Record<string, unknown> | null)?.isAxiosError,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("fetches image from external API and returns buffer", async () => {
    const buf = Buffer.from("image-data");
    mockedGet.mockResolvedValueOnce({ data: buf.buffer });

    const res = makeRes();
    await controller.proxy(makeReq("9001"), res);

    expect(mockedGet).toHaveBeenCalledWith(
      "https://rickandmortyapi.com/api/character/avatar/9001.jpeg",
      { responseType: "arraybuffer" },
    );
    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "image/jpeg");
    expect(res.setHeader).toHaveBeenCalledWith(
      "Cache-Control",
      "public, max-age=86400",
    );
    expect(res.send).toHaveBeenCalled();
  });

  it("returns cached buffer without hitting external API a second time", async () => {
    const buf = Buffer.from("cached-image");
    mockedGet.mockResolvedValue({ data: buf.buffer });

    const res1 = makeRes();
    const res2 = makeRes();

    await controller.proxy(makeReq("9002"), res1);
    await controller.proxy(makeReq("9002"), res2);

    expect(mockedGet).toHaveBeenCalledTimes(1);
    expect(res1.send).toHaveBeenCalled();
    expect(res2.send).toHaveBeenCalled();
  });

  it("deduplicates concurrent requests for the same id", async () => {
    const buf = Buffer.from("concurrent-image");
    mockedGet.mockResolvedValue({ data: buf.buffer });

    const res1 = makeRes();
    const res2 = makeRes();

    await Promise.all([
      controller.proxy(makeReq("9003"), res1),
      controller.proxy(makeReq("9003"), res2),
    ]);

    expect(mockedGet).toHaveBeenCalledTimes(1);
    expect(res1.send).toHaveBeenCalled();
    expect(res2.send).toHaveBeenCalled();
  });

  it("retries on 429 and succeeds on next attempt", async () => {
    jest.useFakeTimers();

    const buf = Buffer.from("ok-after-retry");
    const rateLimitError = Object.assign(new Error("429"), {
      isAxiosError: true,
      response: { status: 429 },
    });

    mockedGet
      .mockRejectedValueOnce(rateLimitError)
      .mockResolvedValueOnce({ data: buf.buffer });

    const res = makeRes();
    const proxyPromise = controller.proxy(makeReq("9004"), res);
    await jest.runAllTimersAsync();
    await proxyPromise;

    expect(mockedGet).toHaveBeenCalledTimes(2);
    expect(res.send).toHaveBeenCalled();
  });

  it("returns 502 after all retries are exhausted", async () => {
    const networkError = Object.assign(new Error("Network Error"), {
      isAxiosError: true,
      response: undefined,
    });
    mockedGet.mockRejectedValue(networkError);

    const res = makeRes();
    await controller.proxy(makeReq("9005"), res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch image" });
  });
});
