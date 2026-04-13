import type { Episode } from '../../types'

interface Props {
    episode: Episode
    onClick: (episode: Episode) => void
}

export function EpisodeCard({ episode, onClick }: Props) {
    return (
        <button
            onClick={() => onClick(episode)}
            className="group text-left w-full bg-[#111827] border border-gray-800 rounded-xl p-4 hover:border-green-500/60 hover:bg-[#131f2e] transition-all duration-200 cursor-pointer"
        >
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                    # {episode.episode}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {episode.characters.length} personagens
                </span>
            </div>
            <h3 className="text-white font-semibold text-base leading-snug group-hover:text-green-300 transition-colors mb-2">
                {episode.name}
            </h3>
            <p className="text-gray-500 text-xs flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {episode.air_date}
            </p>
        </button>
    )
}
