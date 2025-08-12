import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

// mock client from ApiStatus
vi.mock('../api/client', () => ({
  default: { get: vi.fn().mockResolvedValue({ status: 200, data: [] }) }
}))

import ApiStatus from './ApiStatus'

describe('ApiStatus', () => {
  it('renders Connected when API returns 200', async () => {
    render(<ApiStatus />)
    expect(screen.getByText(/API: Checking/i)).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText(/API: Connected/i)).toBeInTheDocument())
  })
})
