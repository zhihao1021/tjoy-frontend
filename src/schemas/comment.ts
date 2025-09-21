export type Comment = Readonly<{
    id: string,
    article_id: string,
    author_id: string | null,
    author_name: string,
    content: string,
}>