type TableColumn = {
    header: string
    field: string, 
    type: string, 
    sort?: number | null | undefined,
}

type FilterTableEvent = {
    field: string,
    value: string | string[] | number | boolean | null | undefined,
    delay?: number
}