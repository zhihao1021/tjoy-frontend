import axios from "axios";

import type { Article } from "@/schemas/article";

export async function getArticleList(): Promise<Article[]> {
    const response = await axios.get<Article[]>("/articles");

    return response.data;
}