import axios from "axios";

import type { Article, ArticleCreate } from "@/schemas/article";
import type { Comment } from "@/schemas/comment";

export async function getArticleList(): Promise<Article[]> {
    const response = await axios.get<Article[]>("/articles");

    return response.data;
}

export async function createArticle(data: ArticleCreate): Promise<Article> {
    const response = await axios.post<Article>("/articles", data);

    return response.data;
}

export async function getArticleById(articleId: string): Promise<Article> {
    const response = await axios.get<Article>(`/articles/${articleId}`);

    return response.data;
}

export async function getArticleComments(articleId: string): Promise<Comment[]> {
    const response = await axios.get<Comment[]>(`/articles/${articleId}/comments`);

    return response.data;
}

export async function postComment(
    articleId: string,
    content: string,
    authorVisibility: 0 | 1 | 2 | 3
): Promise<Comment> {
    const response = await axios.post<Comment>(
        `/articles/${articleId}/comments`,
        { content: content, author_visibility: authorVisibility }
    );

    return response.data;
}
