import axios from "axios";
import type { EpisodeRepository } from "../../domain/ports/EpisodeRepository";
import type { CharacterRepository } from "../../domain/ports/CharacterRepository";
import type { Episode, EpisodesPage } from "../../domain/entities/Episode";
import type { Character } from "../../domain/entities/Character";

const BASE_URL = "https://rickandmortyapi.com/api";

export class RickMortyApiAdapter
  implements EpisodeRepository, CharacterRepository
{
  async findAll(page: number): Promise<EpisodesPage> {
    const response = await axios.get<EpisodesPage>(
      `${BASE_URL}/episode?page=${page}`,
    );
    return response.data;
  }

  async findById(id: number): Promise<Episode> {
    const response = await axios.get<Episode>(`${BASE_URL}/episode/${id}`);
    return response.data;
  }

  async findByIds(ids: number[]): Promise<Character[]> {
    const response = await axios.get<Character | Character[]>(
      `${BASE_URL}/character/${ids.join(",")}`,
    );
    return Array.isArray(response.data) ? response.data : [response.data];
  }
}
