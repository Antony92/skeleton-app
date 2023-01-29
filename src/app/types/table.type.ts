export type TableColumn = {
    header: string
    field: string
    sortable?: boolean
    filtarable?: boolean
    type?: 'text' | 'number' | 'date' | 'select' | 'select-multiple'
    delay?: number
    value?: string
    list?: { label: string, value: string | boolean | number }[]
    order?: 'desc' | 'asc' | null
}
