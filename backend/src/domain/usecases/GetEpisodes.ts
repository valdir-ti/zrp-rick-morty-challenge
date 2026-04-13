import type { EpisodeRepository } from "../ports/EpisodeRepository";

export class GetEpisodes {
  constructor(private readonly episodeRepository: EpisodeRepository) {}

  async execute(page: number = 1) {
    return this.episodeRepository.findAll(page);
  }
}
