import { useEffect, useRef } from 'react'
import type { Episode, Character } from '../../types'
import { CharacterCard } from '../CharacterCard/CharacterCard'

interface Props {
    episode: Episode
    characters: Character[]
    loading: boolean
    loadingProgress: number
    error: string | null
    onClose: () => void
}

export function CharacterModal({ episode, characters, loading, loadingProgress, error, onClose }: Props) {
    const overlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [onClose])

    return (
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Personagens de ${episode.name}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0d1117] border border-gray-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex-shrink-0">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                                {episode.episode}
                            </span>
                            <h2 className="text-white text-xl font-bold mt-2">{episode.name}</h2>
                            <p className="text-gray-400 text-sm mt-1">{episode.air_date}</p>
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Fechar"
                            className="text-gray-500 hover:text-white transition-colors p-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-400 text-sm">
                                Aguarde, carregando imagens...
                            </p>
                            <div className="w-48">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Progresso</span>
                                    <span>{loadingProgress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full transition-all duration-200"
                                        style={{ width: `${loadingProgress}%` }}
                                        role="progressbar"
                                        aria-valuenow={loadingProgress}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {error && <p className="text-red-400 text-center py-8">{error}</p>}
                    {!loading && !error && (
                        <>
                            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Personagens ({characters.length})
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {characters.map((char) => (
                                    <CharacterCard key={char.id} character={char} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
