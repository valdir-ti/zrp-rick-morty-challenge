import { useState } from 'react'
import type { Character } from '../../types'

interface Props {
    character: Character
}

const statusColor: Record<string, string> = {
    Alive: 'bg-green-500',
    Dead: 'bg-red-500',
    unknown: 'bg-gray-500',
}

export function CharacterCard({ character }: Props) {
    const dot = statusColor[character.status] ?? 'bg-gray-500'
    const [imgLoaded, setImgLoaded] = useState(false)
    const [imgError, setImgError] = useState(false)

    return (
        <div className="flex items-center gap-3 bg-[#0d1117] border border-gray-800 rounded-xl p-3">
            <div className="relative w-14 h-14 rounded-lg flex-shrink-0 overflow-hidden bg-gray-800">
                {!imgLoaded && !imgError && (
                    <div className="absolute inset-0 animate-pulse bg-gray-700" />
                )}
                {imgError ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xl">?</div>
                ) : (
                    <img
                        src={character.image}
                        alt={character.name}
                        loading="lazy"
                        className={`w-14 h-14 object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                    />
                )}
            </div>
            <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{character.name}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                    {character.status}
                    <span className="text-gray-600">⇌</span>
                    {character.species}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{character.location.name}</span>
                </p>
            </div>
        </div>
    )
}
