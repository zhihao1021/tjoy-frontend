import axios from "axios";
import { jwtDecode } from "jwt-decode"

import type { Jwt, JwtPayload, LoginData, RegisterData } from "@/schemas/auth";

async function auth(
    action: "login" | "register" | "refresh",
    data?: RegisterData | LoginData
): Promise<string> {
    const response = await (action === "refresh" ?
        axios.put<Jwt>("/auth/refresh") :
        axios.post<Jwt>(
            `/auth/${action}`,
            data
        )
    )

    const {
        token_type,
        access_token
    } = response.data;

    localStorage.setItem("token_type", token_type);
    localStorage.setItem("access_token", access_token);

    const payload = jwtDecode<JwtPayload>(access_token);

    return payload.sub;
}

export async function preCheck(username: string): Promise<void> {
    await axios.post("/auth/pre-check", { username });
}

export async function register(data: RegisterData): Promise<string> {
    return await auth("register", data);
}

export async function login(data: LoginData): Promise<string> {
    return await auth("login", data);
}

export async function refresh(): Promise<string> {
    return await auth("refresh");
}
