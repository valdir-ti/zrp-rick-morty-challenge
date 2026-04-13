import { EpisodeController } from "./EpisodeController";
import type { Request, Response } from "express";

const makeRes = (): Response => {
  const res = {} as Response;
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

const makeGetEpisodes = (result?: unknown, error?: Error) => ({
  execute: error
    ? jest.fn().mockRejectedValue(error)
    : jest.fn().mockResolvedValue(result),
});

const makeGetEpisodeCharacters = (result?: unknown, error?: Error) => ({
  execute: error
    ? jest.fn().mockRejectedValue(error)
    : jest.fn().mockResolvedValue(result),
});

describe("EpisodeController", () => {
  describe("listEpisodes", () => {
    it("should return episodes using the page query param", async () => {
      const data = { info: { pages: 3 }, results: [] };
      const getEpisodes = makeGetEpisodes(data);
      const controller = new EpisodeController(
        getEpisodes as never,
        makeGetEpisodeCharacters() as never,
      );
      const req = { query: { page: "2" } } as unknown as Request;
      const res = makeRes();

      await controller.listEpisodes(req, res);

      expect(getEpisodes.execute).toHaveBeenCalledWith(2);
      expect(res.json).toHaveBeenCalledWith(data);
    });

    it("should default to page 1 when query param is absent", async () => {
      const getEpisodes = makeGetEpisodes({});
      const controller = new EpisodeController(
        getEpisodes as never,
        makeGetEpisodeCharacters() as never,
      );
      const req = { query: {} } as unknown as Request;
      const res = makeRes();

      await controller.listEpisodes(req, res);

      expect(getEpisodes.execute).toHaveBeenCalledWith(1);
    });

    it("should default to page 1 when page param is not a number", async () => {
      const getEpisodes = makeGetEpisodes({});
      const controller = new EpisodeController(
        getEpisodes as never,
        makeGetEpisodeCharacters() as never,
      );
      const req = { query: { page: "abc" } } as unknown as Request;
      const res = makeRes();

      await controller.listEpisodes(req, res);

      expect(getEpisodes.execute).toHaveBeenCalledWith(1);
    });

    it("should return 500 when use case throws", async () => {
      const getEpisodes = makeGetEpisodes(undefined, new Error("fail"));
      const controller = new EpisodeController(
        getEpisodes as never,
        makeGetEpisodeCharacters() as never,
      );
      const req = { query: {} } as unknown as Request;
      const res = makeRes();

      await controller.listEpisodes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch episodes",
      });
    });
  });

  describe("listEpisodeCharacters", () => {
    it("should return characters for a valid episode id", async () => {
      const characters = [{ id: 1, name: "Rick Sanchez" }];
      const getEpisodeCharacters = makeGetEpisodeCharacters(characters);
      const controller = new EpisodeController(
        makeGetEpisodes() as never,
        getEpisodeCharacters as never,
      );
      const req = { params: { id: "1" } } as unknown as Request;
      const res = makeRes();

      await controller.listEpisodeCharacters(req, res);

      expect(getEpisodeCharacters.execute).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(characters);
    });

    it("should return 400 for a non-numeric episode id", async () => {
      const controller = new EpisodeController(
        makeGetEpisodes() as never,
        makeGetEpisodeCharacters() as never,
      );
      const req = { params: { id: "abc" } } as unknown as Request;
      const res = makeRes();

      await controller.listEpisodeCharacters(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid episode id" });
    });

    it("should return 400 when id param is undefined", async () => {
      const controller = new EpisodeController(
        makeGetEpisodes() as never,
        makeGetEpisodeCharacters() as never,
      );
      const req = { params: {} } as unknown as Request;
      const res = makeRes();

      await controller.listEpisodeCharacters(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 when use case throws", async () => {
      const getEpisodeCharacters = makeGetEpisodeCharacters(
        undefined,
        new Error("fail"),
      );
      const controller = new EpisodeController(
        makeGetEpisodes() as never,
        getEpisodeCharacters as never,
      );
      const req = { params: { id: "1" } } as unknown as Request;
      const res = makeRes();

      await controller.listEpisodeCharacters(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch episode characters",
      });
    });
  });
});
