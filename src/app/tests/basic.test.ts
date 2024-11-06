import { test, expect } from 'vitest'
import { escapeHtml } from '@app/utils/html'
import { searchParamsToQuery} from '@app/utils/url'

test('escapeHtml(html: string)', () => {
    const escapedHtml = escapeHtml('<script>alert(1)</script>')
    expect(escapedHtml).not.include('<')
    expect(escapedHtml).not.include('>')
})

test('searchParamsToQuery(params: SearchParams)', () => {
    const params = searchParamsToQuery({ limit: 10, search: 'user' })
    expect(params).toContain('?')
    expect(params).toContain('limit=10')
    expect(params).toContain('search=user')
})