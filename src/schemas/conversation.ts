import type { Article } from "./article"
import type { Message } from "./message"
import type { User } from "./user"

export type Conversation = Readonly<{
    id: string,
    title: string,
    is_private: boolean,
    event: Article | null,
    users: User[],
    latest_message: Message | null,
}>

export type ConversationWithMessages = {
    id: string,
    title: string,
    is_private: boolean,
    event: Article | null,
    users: User[],
    messages: Message[],
}
