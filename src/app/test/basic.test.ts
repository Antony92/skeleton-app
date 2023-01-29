import { test, expect } from 'vitest'
import { escapeHtml } from '../utils/html'
import { searchParams } from '../utils/general'

test('escapeHtml(html: string)', () => {
    const escapedHtml = escapeHtml('<script>alert(1)</script>')
    expect(escapedHtml).not.include('<')
    expect(escapedHtml).not.include('>')
})

test('searchParams(params: { [key: string]: any })', () => {
    const queryParams = searchParams({ limit: 10, search: 'user' })
    expect(queryParams).toContain('?')
    expect(queryParams).toContain('limit=10')
    expect(queryParams).toContain('search=user')
})