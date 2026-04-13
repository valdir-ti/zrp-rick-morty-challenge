# ZRP Challenge — Rick & Morty Explorer

<p align="center">
  <img src="./rick-and-morty.jpg" alt="Rick and Morty" width="320" />
</p>

Aplicação full-stack que lista episódios de Rick & Morty e exibe os personagens de cada episódio.

- **Backend**: Node.js + Express + TypeScript (arquitetura hexagonal)
- **Frontend**: React + Vite + TypeScript servido por nginx
- **API externa**: [rickandmortyapi.com](https://rickandmortyapi.com)

---

## Pré-requisitos

| Opção                | Ferramentas necessárias                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Docker (recomendado) | [Docker](https://docs.docker.com/get-docker/) + [Docker Compose](https://docs.docker.com/compose/) |
| Local                | Node.js 20+ e npm                                                                                  |

---

## Rodando com Docker (recomendado)

Na raiz do projeto:

```bash
docker compose up --build
```

| Serviço  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost      |
| Backend  | http://localhost:3000 |

O nginx do frontend faz proxy automático de `/api/*` → `backend:3000`, então não é necessário configurar nada.

Para parar:

```bash
docker compose down
```

---

## Rodando localmente

### Backend

```bash
cd backend
npm install
npm run dev
```

O servidor inicia em `http://localhost:3000`.

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend inicia em `http://localhost:5173`. Configure o proxy no `vite.config.ts` para apontar `/api` ao backend:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```

---

## Endpoints da API

| Método | Endpoint                   | Descrição                  |
| ------ | -------------------------- | -------------------------- |
| GET    | `/episodes?page=1`         | Lista episódios paginados  |
| GET    | `/episodes/:id/characters` | Personagens de um episódio |

Exemplo:

```bash
curl http://localhost:3000/episodes
curl http://localhost:3000/episodes/1/characters
```

---

## Testes

```bash
cd backend
npm test
```

Para rodar com relatório de cobertura:

```bash
npm test -- --coverage
```

Cobertura atual: **100%** em statements, branches, functions e lines.

---

## Estrutura do projeto

```
zrp-challenge/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── app.ts                          # Wiring (DI)
│   │   ├── server.ts                       # Entry point
│   │   ├── domain/
│   │   │   ├── entities/                   # Episode, Character
│   │   │   ├── ports/                      # Interfaces (output ports)
│   │   │   └── usecases/                   # GetEpisodes, GetEpisodeCharacters
│   │   └── adapters/
│   │       ├── inbound/http/               # EpisodeController (Express)
│   │       └── outbound/                   # RickMortyApiAdapter (Axios)
└── frontend/
    ├── Dockerfile
    ├── nginx.conf                          # Proxy /api → backend, SPA fallback
    └── src/
        └── App.tsx                         # Lista episódios + personagens
```
