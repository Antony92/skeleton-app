export type TableColumn = {
    header: string
    field: string
    type?: string
    values?: { label: string, value: string | boolean | number }[]
    delay?: number,
    sortable?: boolean
    order?: 'asc' | 'desc' | null
}

export type FilterTableEvent = {
    field: string
    value: string | string[] | number | boolean | null | undefined,
    delay?: number
}