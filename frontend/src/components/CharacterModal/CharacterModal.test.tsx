import { render, screen, fireEvent } from '@testing-library/react'
import { CharacterModal } from './CharacterModal'
import type { Episode, Character } from '../../types'

const episode: Episode = {
    id: 1,
    name: 'Pilot',
    air_date: 'December 2, 2013',
    episode: 'S01E01',
    characters: [],
}

const characters: Character[] = [
    {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        image: 'https://example.com/rick.png',
        origin: { name: 'Earth' },
        location: { name: 'Earth (C-137)' },
    },
]

describe('CharacterModal', () => {
    it('renders episode name and code', () => {
        render(
            <CharacterModal episode={episode} characters={characters} loading={false} loadingProgress={0} error={null} onClose={vi.fn()} />,
        )
        expect(screen.getByText('Pilot')).toBeInTheDocument()
        expect(screen.getByText('S01E01')).toBeInTheDocument()
    })

    it('renders character list when not loading', () => {
        render(
            <CharacterModal episode={episode} characters={characters} loading={false} loadingProgress={0} error={null} onClose={vi.fn()} />,
        )
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
        expect(screen.getByText(/Personagens \(1\)/i)).toBeInTheDocument()
    })

    it('shows spinner and progress bar when loading', () => {
        const { container } = render(
            <CharacterModal episode={episode} characters={[]} loading={true} loadingProgress={60} error={null} onClose={vi.fn()} />,
        )
        expect(container.querySelector('.animate-spin')).toBeInTheDocument()
        expect(screen.getByText('60%')).toBeInTheDocument()
        expect(screen.getByText(/aguarde/i)).toBeInTheDocument()
        const bar = screen.getByRole('progressbar')
        expect(bar).toHaveAttribute('aria-valuenow', '60')
    })

    it('shows error message', () => {
        render(
            <CharacterModal episode={episode} characters={[]} loading={false} loadingProgress={0} error="Network error" onClose={vi.fn()} />,
        )
        expect(screen.getByText('Network error')).toBeInTheDocument()
    })

    it('calls onClose when close button is clicked', () => {
        const onClose = vi.fn()
        render(
            <CharacterModal episode={episode} characters={characters} loading={false} loadingProgress={0} error={null} onClose={onClose} />,
        )
        fireEvent.click(screen.getByRole('button', { name: /fechar/i }))
        expect(onClose).toHaveBeenCalled()
    })

    it('calls onClose when Escape key is pressed', () => {
        const onClose = vi.fn()
        render(
            <CharacterModal episode={episode} characters={characters} loading={false} loadingProgress={0} error={null} onClose={onClose} />,
        )
        fireEvent.keyDown(window, { key: 'Escape' })
        expect(onClose).toHaveBeenCalled()
    })
})
