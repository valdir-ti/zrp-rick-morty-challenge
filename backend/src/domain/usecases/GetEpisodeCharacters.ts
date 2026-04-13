import type { EpisodeRepository } from "../ports/EpisodeRepository";
import type { CharacterRepository } from "../ports/CharacterRepository";

export class GetEpisodeCharacters {
  constructor(
    private readonly episodeRepository: EpisodeRepository,
    private readonly characterRepository: CharacterRepository,
  ) {}

  async execute(episodeId: number) {
    const episode = await this.episodeRepository.findById(episodeId);
    const ids = episode.characters
      .map((url) => {
        const segment = url.split("/").pop();
        return segment ? parseInt(segment) : NaN;
      })
      .filter((id) => !isNaN(id));
    return this.characterRepository.findByIds(ids);
  }
}
