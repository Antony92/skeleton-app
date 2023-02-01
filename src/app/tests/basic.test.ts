import { test, expect } from 'vitest'
import { escapeHtml } from '../utils/html'
import { searchParamsToURL } from '../utils/url'

test('escapeHtml(html: string)', () => {
    const escapedHtml = escapeHtml('<script>alert(1)</script>')
    expect(escapedHtml).not.include('<')
    expect(escapedHtml).not.include('>')
})

test('searchParamsToURL(params: SearchParams)', () => {
    const params = searchParamsToURL({ limit: 10, search: 'user' })
    expect(params).toContain('?')
    expect(params).toContain('limit=10')
    expect(params).toContain('search=user')
})