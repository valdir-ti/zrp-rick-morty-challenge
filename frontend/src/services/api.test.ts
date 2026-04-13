import { fetchEpisodes, fetchEpisodeCharacters } from "./api";

const mockEpisodesResponse = {
  info: { count: 51, pages: 3, next: "page=2", prev: null },
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

const mockCharacters = [
  {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    image: "https://example.com/rick.png",
    origin: { name: "Earth" },
    location: { name: "Earth" },
  },
];

describe("fetchEpisodes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns episodes response on success", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEpisodesResponse),
    } as unknown as Response);

    const result = await fetchEpisodes(1);
    expect(result).toEqual(mockEpisodesResponse);
    expect(fetch).toHaveBeenCalledWith("/api/episodes?page=1");
  });

  it("throws on non-ok response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    } as unknown as Response);

    await expect(fetchEpisodes(1)).rejects.toThrow("Failed to fetch episodes");
  });
});

describe("fetchEpisodeCharacters", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns character array on success", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCharacters),
    } as unknown as Response);

    const result = await fetchEpisodeCharacters(1);
    expect(result).toEqual(mockCharacters);
    expect(fetch).toHaveBeenCalledWith("/api/episodes/1/characters");
  });

  it("throws on non-ok response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    } as unknown as Response);

    await expect(fetchEpisodeCharacters(1)).rejects.toThrow(
      "Failed to fetch characters",
    );
  });
});
