import { GetEpisodes } from "./GetEpisodes";
import type { EpisodeRepository } from "../ports/EpisodeRepository";

const mockPage = {
  info: { count: 51, pages: 3, next: "?page=2", prev: null },
  results: [
    {
      id: 1,
      name: "Pilot",
      air_date: "December 2, 2013",
      episode: "S01E01",
      characters: [],
    },
  ],
};

const makeRepo = (
  overrides: Partial<EpisodeRepository> = {},
): EpisodeRepository => ({
  findAll: jest.fn().mockResolvedValue(mockPage),
  findById: jest.fn(),
  ...overrides,
});

describe("GetEpisodes", () => {
  it("should call repository with the given page number", async () => {
    const repo = makeRepo();
    const usecase = new GetEpisodes(repo);

    const result = await usecase.execute(2);

    expect(repo.findAll).toHaveBeenCalledWith(2);
    expect(result).toEqual(mockPage);
  });

  it("should default to page 1 when no argument is provided", async () => {
    const repo = makeRepo();
    const usecase = new GetEpisodes(repo);

    await usecase.execute();

    expect(repo.findAll).toHaveBeenCalledWith(1);
  });

  it("should propagate repository errors", async () => {
    const repo = makeRepo({
      findAll: jest.fn().mockRejectedValue(new Error("Network error")),
    });
    const usecase = new GetEpisodes(repo);

    await expect(usecase.execute(1)).rejects.toThrow("Network error");
  });
});
