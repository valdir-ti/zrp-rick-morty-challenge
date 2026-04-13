import type { Character } from "../entities/Character";

export interface CharacterRepository {
  findByIds(ids: number[]): Promise<Character[]>;
}
