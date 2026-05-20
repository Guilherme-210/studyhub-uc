/**
 * Auth Types
 * Define user, session, and authentication-related types
 */

export interface TUser {
    id: string
    name: string
    email: string
    avatar?: string
    role?: string
}

export interface TSession {
    user: TUser
    accessToken?: string
    expiresAt?: Date
}

export interface TLoginCredentials {
    email: string
    password: string
}

export interface TRegisterData extends TLoginCredentials {
    name: string
}
