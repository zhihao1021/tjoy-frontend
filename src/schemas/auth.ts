export type Jwt = Readonly<{
    token_type: "Bearer",
    access_token: string,
}>

export type JwtPayload = Readonly<{
    sub: string,
    iat: number,
    exp: number,
}>

export type LoginData = {
    username: string,
    password: string,
}

export type RegisterData = {
    username: string,
    display_name: string,
    gender: string,
    department: string,
    password: string,
    onboarding_year: number,
    onboarding_month: number,
    onboarding_day: number,
    interest: string,
}
