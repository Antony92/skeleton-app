export type TableColumn = {
    header: string
    field: string
    type?: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'select-multiple' | undefined | null
    list?: { label: string, value: string | boolean | number }[] | undefined | null 
    delay?: number
    sortable?: boolean
    filtarable?: boolean
}
