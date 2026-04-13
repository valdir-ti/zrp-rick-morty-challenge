import { GetEpisodeCharacters } from "./GetEpisodeCharacters";
import type { EpisodeRepository } from "../ports/EpisodeRepository";
import type { CharacterRepository } from "../ports/CharacterRepository";

const makeEpisodeRepo = (
  overrides: Partial<EpisodeRepository> = {},
): EpisodeRepository => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  ...overrides,
});

const makeCharacterRepo = (
  overrides: Partial<CharacterRepository> = {},
): CharacterRepository => ({
  findByIds: jest.fn(),
  ...overrides,
});

describe("GetEpisodeCharacters", () => {
  const episode = {
    id: 1,
    name: "Pilot",
    air_date: "December 2, 2013",
    episode: "S01E01",
    characters: [
      "https://rickandmortyapi.com/api/character/1",
      "https://rickandmortyapi.com/api/character/2",
    ],
  };

  const characters = [
    {
      id: 1,
      name: "Rick Sanchez",
      status: "Alive",
      species: "Human",
      image: "",
    },
    {
      id: 2,
      name: "Morty Smith",
      status: "Alive",
      species: "Human",
      image: "",
    },
  ];

  it("should fetch episode then fetch its characters by extracted IDs", async () => {
    const episodeRepo = makeEpisodeRepo({
      findById: jest.fn().mockResolvedValue(episode),
    });
    const characterRepo = makeCharacterRepo({
      findByIds: jest.fn().mockResolvedValue(characters),
    });
    const usecase = new GetEpisodeCharacters(episodeRepo, characterRepo);

    const result = await usecase.execute(1);

    expect(episodeRepo.findById).toHaveBeenCalledWith(1);
    expect(characterRepo.findByIds).toHaveBeenCalledWith([1, 2]);
    expect(result).toEqual(characters);
  });

  it("should filter out invalid character URLs", async () => {
    const episodeWithBadUrl = {
      ...episode,
      characters: [
        "https://rickandmortyapi.com/api/character/1",
        "https://rickandmortyapi.com/api/character/",
      ],
    };
    const episodeRepo = makeEpisodeRepo({
      findById: jest.fn().mockResolvedValue(episodeWithBadUrl),
    });
    const characterRepo = makeCharacterRepo({
      findByIds: jest.fn().mockResolvedValue([characters[0]]),
    });
    const usecase = new GetEpisodeCharacters(episodeRepo, characterRepo);

    await usecase.execute(1);

    expect(characterRepo.findByIds).toHaveBeenCalledWith([1]);
  });

  it("should propagate episode repository errors", async () => {
    const episodeRepo = makeEpisodeRepo({
      findById: jest.fn().mockRejectedValue(new Error("Not found")),
    });
    const characterRepo = makeCharacterRepo();
    const usecase = new GetEpisodeCharacters(episodeRepo, characterRepo);

    await expect(usecase.execute(999)).rejects.toThrow("Not found");
  });

  it("should propagate character repository errors", async () => {
    const episodeRepo = makeEpisodeRepo({
      findById: jest.fn().mockResolvedValue(episode),
    });
    const characterRepo = makeCharacterRepo({
      findByIds: jest.fn().mockRejectedValue(new Error("API error")),
    });
    const usecase = new GetEpisodeCharacters(episodeRepo, characterRepo);

    await expect(usecase.execute(1)).rejects.toThrow("API error");
  });
});
