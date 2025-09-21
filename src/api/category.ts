import axios from "axios";

import type { Category } from "@/schemas/category";

export async function getAllCategories(): Promise<Category[]> {
    const response = await axios.get<Category[]>("/categories");

    return response.data;
}
