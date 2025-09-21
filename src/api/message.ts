import type { Conversation } from "@/schemas/conversation";
import type { Message } from "@/schemas/message";
import axios from "axios";

export async function getConversationList(): Promise<Conversation[]> {
    const response = await axios.get<Conversation[]>("/messages");

    return response.data;
}

export async function getPrivateMessageTo(user_id: string): Promise<Conversation> {
    const response = await axios.get<Conversation>(
        `/messages/private-message/${user_id}`
    );

    return response.data
}

export async function getConversationById(conversationId: string): Promise<Conversation> {
    const response = await axios.get<Conversation>(
        `/messages/by-id/${conversationId}`
    );

    return response.data;
}

export async function getMessagesOfConversation(conversationId: string): Promise<Message[]> {
    const response = await axios.get<Message[]>(
        `/messages/by-id/${conversationId}/messages`
    );

    return response.data;
}