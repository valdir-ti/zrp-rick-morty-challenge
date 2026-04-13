import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from './Pagination'

describe('Pagination', () => {
    const defaults = {
        current: 2,
        total: 3,
        hasNext: true,
        hasPrev: true,
        onNext: vi.fn(),
        onPrev: vi.fn(),
    }

    it('displays current page and total', () => {
        render(<Pagination {...defaults} />)
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('calls onPrev when previous button is clicked', async () => {
        const onPrev = vi.fn()
        render(<Pagination {...defaults} onPrev={onPrev} />)
        await userEvent.click(screen.getByRole('button', { name: /anterior/i }))
        expect(onPrev).toHaveBeenCalled()
    })

    it('calls onNext when next button is clicked', async () => {
        const onNext = vi.fn()
        render(<Pagination {...defaults} onNext={onNext} />)
        await userEvent.click(screen.getByRole('button', { name: /próxima/i }))
        expect(onNext).toHaveBeenCalled()
    })

    it('disables prev button when hasPrev is false', () => {
        render(<Pagination {...defaults} hasPrev={false} />)
        expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled()
    })

    it('disables next button when hasNext is false', () => {
        render(<Pagination {...defaults} hasNext={false} />)
        expect(screen.getByRole('button', { name: /próxima/i })).toBeDisabled()
    })
})
