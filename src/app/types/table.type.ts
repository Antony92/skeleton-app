export type TableColumn = {
    header: string
    field: string
    type: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'select-multiple'
    values?: { label: string, value: string | boolean | number }[]
}