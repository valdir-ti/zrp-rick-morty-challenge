import type { EpisodesResponse, Character } from "../types";

const BASE = "/api";

export async function fetchEpisodes(page: number): Promise<EpisodesResponse> {
  const res = await fetch(`${BASE}/episodes?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch episodes");
  return res.json() as Promise<EpisodesResponse>;
}

export async function fetchEpisodeCharacters(
  episodeId: number,
): Promise<Character[]> {
  const res = await fetch(`${BASE}/episodes/${episodeId}/characters`);
  if (!res.ok) throw new Error("Failed to fetch characters");
  return res.json() as Promise<Character[]>;
}
