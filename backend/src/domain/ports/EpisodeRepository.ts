import type { Episode, EpisodesPage } from "../entities/Episode";

export interface EpisodeRepository {
  findAll(page: number): Promise<EpisodesPage>;
  findById(id: number): Promise<Episode>;
}
