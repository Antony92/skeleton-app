export type TableColumn = {
    sortable?: boolean
    filtarable?: boolean
    header: string
    field: string
    type?: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'select-multiple'
    delay?: number
    selected?: string
    list?: { label: string, value: string | boolean | number }[]
    order?: 'desc' | 'asc' | null
}
