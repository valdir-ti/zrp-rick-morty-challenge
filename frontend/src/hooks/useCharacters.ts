import { useState, useCallback } from "react";
import { fetchEpisodeCharacters } from "../services/api";
import type { Character, Episode } from "../types";

interface UseCharactersReturn {
  selectedEpisode: Episode | null;
  characters: Character[];
  loading: boolean;
  loadingProgress: number;
  error: string | null;
  open: (episode: Episode) => void;
  close: () => void;
}

function preloadImages(
  characters: Character[],
  onProgress: (pct: number) => void,
): Promise<void> {
  if (characters.length === 0) {
    onProgress(100);
    return Promise.resolve();
  }
  let done = 0;
  const total = characters.length;
  const tick = () => {
    done++;
    onProgress(Math.round((done / total) * 100));
  };
  const promises = characters.map(
    (c) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          tick();
          resolve();
        };
        img.onerror = () => {
          tick();
          resolve();
        };
        img.src = c.image;
      }),
  );
  return Promise.all(promises).then(() => undefined);
}

export function useCharacters(): UseCharactersReturn {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const open = useCallback((episode: Episode) => {
    setSelectedEpisode(episode);
    setCharacters([]);
    setLoading(true);
    setLoadingProgress(0);
    setError(null);
    fetchEpisodeCharacters(episode.id)
      .then((chars) => {
        const sorted = [...chars].sort((a, b) => a.name.localeCompare(b.name));
        return preloadImages(sorted, setLoadingProgress).then(() => sorted);
      })
      .then(setCharacters)
      .catch(() => setError("Não foi possível carregar os personagens."))
      .finally(() => setLoading(false));
  }, []);

  const close = useCallback(() => {
    setSelectedEpisode(null);
    setCharacters([]);
    setLoadingProgress(0);
    setError(null);
  }, []);

  return {
    selectedEpisode,
    characters,
    loading,
    loadingProgress,
    error,
    open,
    close,
  };
}
