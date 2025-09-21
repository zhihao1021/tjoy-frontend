import axios from "axios";

import type { Article, ArticleCreate } from "@/schemas/article";

export async function getArticleList(): Promise<Article[]> {
    const response = await axios.get<Article[]>("/articles");

    return response.data;
}

export async function createArticle(data: ArticleCreate): Promise<Article> {
    const response = await axios.post<Article>("/articles", data);

    return response.data;
}
