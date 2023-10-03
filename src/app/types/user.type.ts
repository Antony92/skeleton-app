export type User = {
    id: string
    name: string
    username: string
    roles: string[]
    impersonated?: string
} | null

export enum Role {
    GUEST = 'GUEST',
    ADMIN = 'ADMIN',
}
