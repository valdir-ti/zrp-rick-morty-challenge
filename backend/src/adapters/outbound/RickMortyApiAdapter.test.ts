import axios from "axios";
import { RickMortyApiAdapter } from "./RickMortyApiAdapter";

jest.mock("axios");

const mockedGet = axios.get as jest.Mock;

describe("RickMortyApiAdapter", () => {
  let adapter: RickMortyApiAdapter;

  beforeEach(() => {
    adapter = new RickMortyApiAdapter();
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should fetch episodes for the given page", async () => {
      const data = {
        info: { count: 51, pages: 3, next: "?page=2", prev: null },
        results: [],
      };
      mockedGet.mockResolvedValue({ data });

      const result = await adapter.findAll(2);

      expect(mockedGet).toHaveBeenCalledWith(
        "https://rickandmortyapi.com/api/episode?page=2",
      );
      expect(result).toEqual(data);
    });

    it("should propagate network errors", async () => {
      mockedGet.mockRejectedValue(new Error("Network Error"));

      await expect(adapter.findAll(1)).rejects.toThrow("Network Error");
    });
  });

  describe("findById", () => {
    it("should fetch a single episode by id", async () => {
      const data = {
        id: 1,
        name: "Pilot",
        air_date: "December 2, 2013",
        episode: "S01E01",
        characters: [],
      };
      mockedGet.mockResolvedValue({ data });

      const result = await adapter.findById(1);

      expect(mockedGet).toHaveBeenCalledWith(
        "https://rickandmortyapi.com/api/episode/1",
      );
      expect(result).toEqual(data);
    });

    it("should propagate network errors", async () => {
      mockedGet.mockRejectedValue(new Error("Not Found"));

      await expect(adapter.findById(999)).rejects.toThrow("Not Found");
    });
  });

  describe("findByIds", () => {
    it("should fetch multiple characters and return them as array", async () => {
      const data = [
        {
          id: 1,
          name: "Rick Sanchez",
          status: "Alive",
          species: "Human",
          image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        },
        {
          id: 2,
          name: "Morty Smith",
          status: "Alive",
          species: "Human",
          image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
        },
      ];
      mockedGet.mockResolvedValue({ data });

      const result = await adapter.findByIds([1, 2]);

      expect(mockedGet).toHaveBeenCalledWith(
        "https://rickandmortyapi.com/api/character/1,2",
      );
      expect(result).toEqual([
        { ...data[0], image: "/images/character/1" },
        { ...data[1], image: "/images/character/2" },
      ]);
    });

    it("should wrap a single character object in an array", async () => {
      const data = {
        id: 1,
        name: "Rick Sanchez",
        status: "Alive",
        species: "Human",
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      };
      mockedGet.mockResolvedValue({ data });

      const result = await adapter.findByIds([1]);

      expect(result).toEqual([{ ...data, image: "/images/character/1" }]);
    });

    it("should propagate network errors", async () => {
      mockedGet.mockRejectedValue(new Error("Network Error"));

      await expect(adapter.findByIds([1])).rejects.toThrow("Network Error");
    });
  });
});
