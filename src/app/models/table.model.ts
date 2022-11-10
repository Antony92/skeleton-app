type TableColumn = {
    header: string
    field: string, 
    type: string, 
    sort?: number | null | undefined,
}

type FilterTableEvent = {
    field: string,
    type: 'number' | 'string' | 'boolean' | 'date' | 'select',
    value: string | string[] | number | boolean | null | undefined
}