import { render, screen } from '@testing-library/react'
import { CharacterCard } from './CharacterCard'
import type { Character } from '../../types'

const makeCharacter = (overrides: Partial<Character> = {}): Character => ({
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    image: 'https://example.com/rick.png',
    origin: { name: 'Earth' },
    location: { name: 'Earth (C-137)' },
    ...overrides,
})

describe('CharacterCard', () => {
    it('renders character name, species, and location', () => {
        render(<CharacterCard character={makeCharacter()} />)

        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
        expect(screen.getByText(/Human/)).toBeInTheDocument()
        expect(screen.getByText('Earth (C-137)')).toBeInTheDocument()
    })

    it('renders character image with alt text', () => {
        render(<CharacterCard character={makeCharacter()} />)

        const img = screen.getByRole('img', { name: 'Rick Sanchez' })
        expect(img).toHaveAttribute('src', 'https://example.com/rick.png')
    })

    it('shows green dot for Alive status', () => {
        const { container } = render(<CharacterCard character={makeCharacter({ status: 'Alive' })} />)
        const dot = container.querySelector('.bg-green-500')
        expect(dot).toBeInTheDocument()
    })

    it('shows red dot for Dead status', () => {
        const { container } = render(<CharacterCard character={makeCharacter({ status: 'Dead' })} />)
        const dot = container.querySelector('.bg-red-500')
        expect(dot).toBeInTheDocument()
    })

    it('shows gray dot for unknown status', () => {
        const { container } = render(<CharacterCard character={makeCharacter({ status: 'unknown' })} />)
        const dot = container.querySelector('.bg-gray-500')
        expect(dot).toBeInTheDocument()
    })
})
