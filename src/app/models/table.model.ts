type Column = {
    header: string
    field: string, 
    type: string, 
    sort?: number | null | undefined,
}

type FilterColumnEvent = {
    column: Column,
    value: string | string[] | number | boolean | null | undefined
}