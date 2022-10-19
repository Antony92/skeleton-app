import { test, expect } from 'vitest'
import { escapeHtml } from '../utils/html'
import { toQueryParams } from '../utils/http'

test('escapeHtml(html: string)', () => {
    const escapedHtml = escapeHtml('<script>alert(1)</script>')
    expect(escapedHtml).to.not.include('<')
    expect(escapedHtml).to.not.include('>')
})

test('toQueryParams(params: { [key: string]: string | boolean | number })', () => {
    const queryParams = toQueryParams({ limit: 10, search: 'user' })
    expect(queryParams).to.contain('?')
    expect(queryParams).to.contain('limit=10')
    expect(queryParams).to.contain('search=user')
})