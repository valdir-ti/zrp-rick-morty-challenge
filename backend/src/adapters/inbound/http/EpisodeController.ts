import type { Request, Response } from "express";
import type { GetEpisodes } from "../../../domain/usecases/GetEpisodes";
import type { GetEpisodeCharacters } from "../../../domain/usecases/GetEpisodeCharacters";

export class EpisodeController {
  constructor(
    private readonly getEpisodes: GetEpisodes,
    private readonly getEpisodeCharacters: GetEpisodeCharacters,
  ) {}

  async listEpisodes(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(String(req.query["page"])) || 1;
      const data = await this.getEpisodes.execute(page);
      res.json(data);
    } catch {
      res.status(500).json({ error: "Failed to fetch episodes" });
    }
  }

  async listEpisodeCharacters(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params["id"]));
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid episode id" });
        return;
      }
      const data = await this.getEpisodeCharacters.execute(id);
      res.json(data);
    } catch {
      res.status(500).json({ error: "Failed to fetch episode characters" });
    }
  }
}
