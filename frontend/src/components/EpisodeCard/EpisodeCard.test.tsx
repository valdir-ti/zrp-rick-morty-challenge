import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EpisodeCard } from './EpisodeCard'
import type { Episode } from '../../types'

const episode: Episode = {
    id: 1,
    name: 'Pilot',
    air_date: 'December 2, 2013',
    episode: 'S01E01',
    characters: ['url1', 'url2', 'url3'],
}

describe('EpisodeCard', () => {
    it('renders episode code, name, air date, and character count', () => {
        render(<EpisodeCard episode={episode} onClick={vi.fn()} />)

        expect(screen.getByText(/S01E01/)).toBeInTheDocument()
        expect(screen.getByText('Pilot')).toBeInTheDocument()
        expect(screen.getByText(/December 2, 2013/)).toBeInTheDocument()
        expect(screen.getByText(/3 personagens/)).toBeInTheDocument()
    })

    it('calls onClick with the episode when clicked', async () => {
        const onClick = vi.fn()
        render(<EpisodeCard episode={episode} onClick={onClick} />)

        await userEvent.click(screen.getByRole('button'))

        expect(onClick).toHaveBeenCalledWith(episode)
    })
})
