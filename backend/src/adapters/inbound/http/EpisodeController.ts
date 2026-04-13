import type { Request, Response } from "express";
import type { GetEpisodes } from "../../../domain/usecases/GetEpisodes";
import type { GetEpisodeCharacters } from "../../../domain/usecases/GetEpisodeCharacters";
import type { ImageProxyController } from "./ImageProxyController";

export class EpisodeController {
  constructor(
    private readonly getEpisodes: GetEpisodes,
    private readonly getEpisodeCharacters: GetEpisodeCharacters,
    private readonly imageProxy: ImageProxyController,
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
      // Prefetch images in the background so they are cached before the
      // browser requests them — eliminates the visible loading delay.
      this.imageProxy.prefetch(data.map((c) => String(c.id)));
    } catch {
      res.status(500).json({ error: "Failed to fetch episode characters" });
    }
  }
}
