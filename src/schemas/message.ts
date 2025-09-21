export type Message = Readonly<{
    id: string,
    author_id: string,
    conversation_id: string,
    context: string,
    translated_context: string,
}>