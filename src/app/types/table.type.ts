export type TableColumn = {
    header: string
    field: string
    sortable?: boolean
    filtarable?: boolean
    type?: 'text' | 'number' | 'date' | 'select' | 'select-multiple'
    delay?: number
    search?: string
    list?: { label: string, value: string | boolean | number }[]
    order?: 'desc' | 'asc' | null
}
