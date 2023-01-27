export type TableColumn = {
    header: string
    field: string
    type?: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'select-multiple'
    delay?: number
    sortable?: boolean
    filtarable?: boolean
    selected?: string | string[]
    list?: { label: string, value: string | boolean | number }[] 
}
