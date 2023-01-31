import { test, expect } from 'vitest'
import { escapeHtml } from '../utils/html'
import { transformToSearchParams } from '../utils/url'

test('escapeHtml(html: string)', () => {
    const escapedHtml = escapeHtml('<script>alert(1)</script>')
    expect(escapedHtml).not.include('<')
    expect(escapedHtml).not.include('>')
})

test('transformToSearchParams(params: { [key: string]: any })', () => {
    const params = transformToSearchParams({ limit: 10, search: 'user' })
    expect(params).toContain('?')
    expect(params).toContain('limit=10')
    expect(params).toContain('search=user')
})