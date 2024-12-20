export type PaginatedResponse<T> = { 
    total: number,
    data: T[]
}

export type GenericResponse<T> = { 
    data: T
}

export type ArrayResponse<T> = T[]