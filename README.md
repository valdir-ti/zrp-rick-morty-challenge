# ZRP Challenge — Rick & Morty Explorer

<p align="center">
  <img src="./rick-and-morty.jpg" alt="Rick and Morty" width="320" />
</p>

Aplicação full-stack que lista episódios de Rick & Morty e exibe os personagens de cada episódio.

## Tecnologias

| Camada      | Stack                                                                       |
| ----------- | --------------------------------------------------------------------------- |
| Backend     | Node.js 22, Express 5, TypeScript 6, Axios — arquitetura hexagonal          |
| Frontend    | React 19, Vite, Tailwind CSS v4, TypeScript — servido por nginx em produção |
| Testes      | Backend: Jest + ts-jest · Frontend: Vitest + @testing-library/react         |
| API externa | [rickandmortyapi.com](https://rickandmortyapi.com)                          |

---

## Pré-requisitos

| Opção                | Ferramentas necessárias                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Docker (recomendado) | [Docker](https://docs.docker.com/get-docker/) + [Docker Compose](https://docs.docker.com/compose/) |
| Local                | Node.js 22+ e npm                                                                                  |

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

O nginx do frontend encaminha automaticamente `/api/*` → `backend:3000` e `/images/*` → `backend:3000/images/*`, sem nenhuma configuração adicional.

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

O frontend inicia em `http://localhost:5173`. O proxy para `/api` e `/images` já está configurado em `vite.config.ts` — basta ter o backend rodando.

---

## Endpoints da API

| Método | Endpoint                   | Descrição                                         |
| ------ | -------------------------- | ------------------------------------------------- |
| GET    | `/episodes?page=1`         | Lista episódios paginados                         |
| GET    | `/episodes/:id/characters` | Personagens de um episódio (ordenados por nome)   |
| GET    | `/images/character/:id`    | Proxy de imagem com cache e rate-limit automático |

Exemplo:

```bash
curl http://localhost:3000/episodes
curl http://localhost:3000/episodes/1/characters
curl http://localhost:3000/images/character/1
```

---

## Testes

### Backend

```bash
cd backend
npm test
```

Para rodar com relatório de cobertura:

```bash
npm test -- --coverage
```

Cobertura atual: **100%** em statements, branches, functions e lines.

### Frontend

```bash
cd frontend
npm test
```

Para rodar com relatório de cobertura:

```bash
npm run test:coverage
```

---

## Estrutura do projeto

```
zrp-challenge/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   └── src/
│       ├── app.ts                          # Wiring (injeção de dependências)
│       ├── server.ts                       # Entry point
│       ├── domain/
│       │   ├── entities/                   # Episode, Character
│       │   ├── ports/                      # Interfaces (output ports)
│       │   └── usecases/                   # GetEpisodes, GetEpisodeCharacters
│       └── adapters/
│           ├── inbound/http/
│           │   ├── EpisodeController.ts    # Rotas /episodes
│           │   └── ImageProxyController.ts # Proxy /images com cache + retry
│           └── outbound/
│               └── RickMortyApiAdapter.ts  # Integração com rickandmortyapi.com
└── frontend/
    ├── Dockerfile
    ├── nginx.conf                          # Proxy /api e /images → backend, SPA fallback
    └── src/
        ├── App.tsx
        ├── components/
        │   ├── CharacterCard/              # Card com skeleton e lazy loading
        │   ├── CharacterModal/             # Modal com barra de progresso de carregamento
        │   ├── EpisodeCard/
        │   ├── EpisodeList/
        │   └── Pagination/
        ├── hooks/
        │   ├── useEpisodes.ts              # Busca e paginação de episódios
        │   └── useCharacters.ts            # Busca, pré-carregamento e progresso de imagens
        ├── services/                       # Chamadas HTTP à API
        └── types/                          # Tipos compartilhados (Episode, Character)
```
