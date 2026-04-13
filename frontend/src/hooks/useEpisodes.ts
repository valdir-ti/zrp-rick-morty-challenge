import { useState, useEffect } from "react";
import { fetchEpisodes } from "../services/api";
import type { Episode, PageInfo } from "../types";

interface UseEpisodesReturn {
  episodes: Episode[];
  info: PageInfo | null;
  page: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
}

export function useEpisodes(): UseEpisodesReturn {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [info, setInfo] = useState<PageInfo | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchEpisodes(page)
      .then((data) => {
        if (cancelled) return;
        setEpisodes(data.results);
        setInfo(data.info);
      })
      .catch(() => {
        if (!cancelled) setError("Não foi possível carregar os episódios.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  return { episodes, info, page, loading, error, setPage };
}
