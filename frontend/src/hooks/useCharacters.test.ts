import { renderHook, act, waitFor } from "@testing-library/react";
import { useCharacters } from "./useCharacters";
import * as api from "../services/api";
import type { Character, Episode } from "../types";

vi.mock("../services/api");

const episode: Episode = {
  id: 1,
  name: "Pilot",
  air_date: "December 2, 2013",
  episode: "S01E01",
  characters: [],
};

const characters: Character[] = [
  {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    image: "/images/character/1",
    origin: { name: "Earth" },
    location: { name: "Earth (C-137)" },
  },
];

// Stub Image so preloadImages resolves immediately in jsdom
class StubImage {
  set src(_: string) {
    this.onload?.();
  }
  onload: (() => void) | undefined;
  onerror: (() => void) | undefined;
}

beforeAll(() => {
  vi.stubGlobal("Image", StubImage);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("useCharacters", () => {
  beforeEach(() => {
    vi.mocked(api.fetchEpisodeCharacters).mockResolvedValue(characters);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("starts with no episode selected and not loading", () => {
    const { result } = renderHook(() => useCharacters());
    expect(result.current.selectedEpisode).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.loadingProgress).toBe(0);
    expect(result.current.characters).toHaveLength(0);
  });

  it("opens modal and waits for images before setting characters", async () => {
    const { result } = renderHook(() => useCharacters());

    act(() => {
      result.current.open(episode);
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.selectedEpisode).toEqual(episode);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.characters).toEqual(characters);
    expect(result.current.loadingProgress).toBe(100);
  });

  it("sets error and stops loading when fetch fails", async () => {
    vi.mocked(api.fetchEpisodeCharacters).mockRejectedValue(
      new Error("network"),
    );
    const { result } = renderHook(() => useCharacters());

    act(() => {
      result.current.open(episode);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(
      "Não foi possível carregar os personagens.",
    );
    expect(result.current.characters).toHaveLength(0);
  });

  it("close resets state", async () => {
    const { result } = renderHook(() => useCharacters());

    act(() => {
      result.current.open(episode);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.close();
    });

    expect(result.current.selectedEpisode).toBeNull();
    expect(result.current.characters).toHaveLength(0);
  });
});
