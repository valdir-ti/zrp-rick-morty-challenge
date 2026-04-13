interface Props {
    current: number
    total: number
    hasNext: boolean
    hasPrev: boolean
    onNext: () => void
    onPrev: () => void
}

export function Pagination({ current, total, hasNext, hasPrev, onNext, onPrev }: Props) {
    return (
        <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>
                Página <span className="text-white font-semibold">{current}</span> de{' '}
                <span className="text-white font-semibold">{total}</span>
            </span>
            <button
                onClick={onPrev}
                disabled={!hasPrev}
                aria-label="Página anterior"
                className="px-3 py-1 rounded-md border border-gray-700 enabled:hover:border-green-500 enabled:hover:text-green-400 disabled:opacity-30 transition-colors"
            >
                ←
            </button>
            <button
                onClick={onNext}
                disabled={!hasNext}
                aria-label="Próxima página"
                className="px-3 py-1 rounded-md border border-gray-700 enabled:hover:border-green-500 enabled:hover:text-green-400 disabled:opacity-30 transition-colors"
            >
                →
            </button>
        </div>
    )
}
