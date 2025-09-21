import { useContext, useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { ConversationWithMessages } from "@/schemas/conversation";

import { getConversationById, getConversationList, getMessagesOfConversation } from "@/api/message";

import { userDataContext } from "@/context/userData";
import { loadingContext } from "@/context/loading";
import { errorQueueContext } from "@/context/errorQueue";

import defaultAvatar from "@/assets/default_avatar.svg";

import styles from "./index.module.scss";
import type { Message } from "@/schemas/message";

function getWsUrl(): string {
    let apiEndpoint = import.meta.env.VITE_API_END_POINT;
    if (!apiEndpoint.startsWith("http")) {
        apiEndpoint = `${window.location.origin}${apiEndpoint}`;
    }

    apiEndpoint = apiEndpoint.replace("http", "ws");


    return `${apiEndpoint}/messages/ws`;
}

function generateConversationName(
    conv: ConversationWithMessages,
    userId: string,
): string {
    if (conv.is_private) {
        const otherMember = conv.users.find(m => m.id !== userId);

        return otherMember?.display_name ?? "未知用戶";
    }

    if (conv.event) {
        return conv.event.title;
    }

    return "未知群組";
}

export default function ChatPage(): ReactNode {
    const [tab, setTab] = useState<"event" | "private">("event");
    const [conversations, setConversations] = useState<ConversationWithMessages[]>([]);
    const [inputText, setInputText] = useState<string>("");

    const [ws, setWs] = useState<WebSocket | null>(null);

    const { userData } = useContext(userDataContext);
    const { useLoading } = useContext(loadingContext);
    const { addError } = useContext(errorQueueContext);

    if (!userData) return undefined;

    const navigate = useNavigate();

    const {
        conversationId
    } = useParams();

    const [
        eventConversations,
        privateConversations
    ] = conversations.reduce<[
        ConversationWithMessages[],
        ConversationWithMessages[]
    ]>((prev, curr) => {
        return curr.is_private ? [
            prev[0], [...prev[1], curr]
        ] : [[...prev[0], curr], prev[1]];
    }, [[], []])

    const displayConversations = tab === "event" ? eventConversations : privateConversations;

    const currentConv = conversationId ? conversations.find(d => d.id === conversationId) : null;

    const sendMessage = () => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        if (!inputText || !conversationId) return;

        ws.send(JSON.stringify({
            conversation_id: conversationId,
            message: inputText,
        }));

        setInputText("");
    }

    useEffect(() => {
        useLoading(getConversationList().then(data => {
            setConversations(data.map(d => {
                getMessagesOfConversation(d.id).then(msgs => {
                    setConversations(prev => prev.map(d2 => {
                        if (d2.id === d.id) {
                            return {
                                ...d2,
                                messages: msgs
                            }
                        }
                        return d2;
                    }))
                });

                return {
                    ...d,
                    messages: d.latest_message ? [d.latest_message] : []
                }
            }));
        }).catch(addError))

        function initWs(oldWs: WebSocket | null): WebSocket {
            if (oldWs) {
                oldWs.close();
            }

            const ws = new WebSocket(getWsUrl());
            ws.onopen = () => {
                ws.send(localStorage.getItem("access_token") ?? "");
            }
            ws.onmessage = async event => {
                const data = JSON.parse(await (event.data as Blob).text()) as Message;

                setConversations(prev => prev.map(conv => {
                    if (conv.id === data.conversation_id) {
                        return {
                            ...conv,
                            messages: [...conv.messages, data]
                        }
                    }
                    return conv;
                }))
                data.conversation_id
            }
            ws.onclose = () => {
                setWs(initWs);
            }

            return ws;
        }

        setWs(initWs);
    }, [useLoading, addError]);

    useEffect(() => {
        if (!conversationId) {
            navigate(`/chat`);
            return;
        }

        getConversationById(conversationId).catch(() => {
            navigate(`/chat`);
        });
    }, [conversationId, navigate]);

    useEffect(() => () => {
        if (!ws) return;

        ws.onclose = () => { };
        ws.close();
    }, [ws]);


    return <div className={styles.chat}>
        <div className={styles.conversations}>
            <div className={styles.tab} data-tab={tab}>
                <button
                    onClick={() => setTab("event")}
                >活動群組</button>
                <button
                    onClick={() => setTab("private")}
                >私人訊息</button>
            </div>
            <div className={styles.conversationList}>
                {
                    displayConversations.length > 0 ? displayConversations.map(conv => <Link
                        key={conv.id}
                        to={`/chat/${conv.id}`}
                    >
                        <img
                            alt={`avatar of conversation ${conv.id}`}
                            src={defaultAvatar}
                        />
                        <div className={styles.info}>
                            <div className={styles.name}>{
                                generateConversationName(conv, userData.id)
                            }</div>
                            <div className={styles.latestMessage}>{
                                conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].context : "尚無訊息"
                            }</div>
                        </div>
                    </Link>) : <div className={styles.noConversation}>
                        尚無訊息
                    </div>
                }
            </div>
        </div>
        <div className={styles.messages}>
            {
                currentConv ? <div className={styles.current}>
                    <div className={styles.header}>
                        <img
                            alt="avatar of current conversation"
                            src={defaultAvatar}
                        />
                        <div
                            className={styles.title}
                        >{generateConversationName(
                            currentConv, userData.id
                        )}</div>
                    </div>
                    <div className={styles.messageList}>
                        {
                            currentConv.messages.map(msg => <>
                                <div
                                    key={msg.id}
                                    className={styles.message}
                                    data-self={msg.author_id === userData.id}
                                >
                                    {msg.context}
                                </div>
                                {msg.translated_context && <div
                                    className={styles.translate}
                                >{msg.translated_context}</div>}
                            </>)
                        }
                    </div>
                    <div className={styles.inputArea}>
                        <label>
                            <input
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter" && !e.shiftKey && inputText) {
                                        sendMessage();
                                    }
                                }}
                            />
                        </label>
                        <button
                            className={`${styles.send} ms`}
                            onClick={sendMessage}
                        >send</button>
                    </div>
                </div> : <div className={styles.noSelection}>
                    <div>請選擇一個對話</div>
                </div>
            }
        </div>
    </div>
}