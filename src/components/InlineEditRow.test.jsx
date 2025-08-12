import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InlineEditRow from './InlineEditRow'

describe('InlineEditRow', () => {
  it('calls onSave with trimmed values', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockResolvedValue()
    render(<table><tbody><InlineEditRow onSave={onSave} /></tbody></table>)

    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], '  New Name  ')
    await user.type(inputs[1], '  AA  ')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(onSave).toHaveBeenCalledWith({ name: 'New Name', code: 'AA' })
  })
})
