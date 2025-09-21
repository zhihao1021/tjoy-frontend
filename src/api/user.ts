import axios from "axios";

import type { User } from "@/schemas/user";

async function _getUserById(userId?: string): Promise<User> {
    const response = await axios.get<User>(
        userId ? `/users/by-id/${userId}` : "/users"
    );

    return response.data;
}

export async function getCurrentUser(): Promise<User> {
    return await _getUserById();
}

export async function getUserById(userId: string): Promise<User> {
    return await _getUserById(userId);
}

export async function getUserByUsername(username: string): Promise<User> {
    const response = await axios.get<User>(`/users/by-username/${username}`);

    return response.data;
}
