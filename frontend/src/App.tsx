import { useEpisodes } from './hooks/useEpisodes'
import { useCharacters } from './hooks/useCharacters'
import { EpisodeCard } from './components/EpisodeCard/EpisodeCard'
import { Pagination } from './components/Pagination/Pagination'
import { CharacterModal } from './components/CharacterModal/CharacterModal'

function App() {
  const { episodes, info, page, loading, error, setPage } = useEpisodes()
  const { selectedEpisode, characters, loading: charLoading, loadingProgress, error: charError, open, close } = useCharacters()

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Rick &amp; Morty</h1>
          <p className="text-gray-400 text-sm">Explorador de Episódios</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Summary bar */}
        {info && !loading && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-medium">{info.count}</span> episódios encontrados
            </p>
            <p className="text-gray-400 text-sm">
              Página <span className="text-white font-medium">{page}</span> de{' '}
              <span className="text-white font-medium">{info.pages}</span>
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-400 text-center py-16">{error}</p>
        )}

        {/* Episode grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} onClick={open} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {info && !loading && (
          <div className="mt-8">
            <Pagination
              current={page}
              total={info.pages}
              hasNext={!!info.next}
              hasPrev={!!info.prev}
              onNext={() => setPage(page + 1)}
              onPrev={() => setPage(page - 1)}
            />
          </div>
        )}
      </main>

      {/* Character modal */}
      {selectedEpisode && (
        <CharacterModal
          episode={selectedEpisode}
          characters={characters}
          loading={charLoading}
          loadingProgress={loadingProgress}
          error={charError}
          onClose={close}
        />
      )}
    </div>
  )
}


export default App
