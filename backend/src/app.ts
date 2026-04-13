import express from "express";
import { RickMortyApiAdapter } from "./adapters/outbound/RickMortyApiAdapter";
import { GetEpisodes } from "./domain/usecases/GetEpisodes";
import { GetEpisodeCharacters } from "./domain/usecases/GetEpisodeCharacters";
import { EpisodeController } from "./adapters/inbound/http/EpisodeController";
import { ImageProxyController } from "./adapters/inbound/http/ImageProxyController";

const app = express();
app.use(express.json());

// Outbound adapter (implements both output ports)
const rickMortyAdapter = new RickMortyApiAdapter();

// Use cases (domain core)
const getEpisodes = new GetEpisodes(rickMortyAdapter);
const getEpisodeCharacters = new GetEpisodeCharacters(
  rickMortyAdapter,
  rickMortyAdapter,
);

// Inbound adapter (HTTP)
const imageProxyController = new ImageProxyController();
const episodeController = new EpisodeController(
  getEpisodes,
  getEpisodeCharacters,
  imageProxyController,
);

app.get("/episodes", (req, res) => episodeController.listEpisodes(req, res));
app.get("/episodes/:id/characters", (req, res) =>
  episodeController.listEpisodeCharacters(req, res),
);

app.get("/images/character/:id", (req, res) =>
  imageProxyController.proxy(req, res),
);

export default app;
