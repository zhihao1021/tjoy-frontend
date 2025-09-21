export type User = Readonly<{
    id: string,
    username: string,
    display_name: string,
    gender: string,
    department: string,
    onboarding_year: number,
    onboarding_month: number,
    onboarding_day: number,
    interest: string,
}>

export type UserUpdate = {
    display_name?: string,
    gender?: string,
    department?: string,
    password?: string,
    onboarding_year?: number,
    onboarding_month?: number,
    onboarding_day?: number,
    interest?: string,
}
