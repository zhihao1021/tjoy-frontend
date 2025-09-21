import { useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Article } from "@/schemas/article";
import type { Comment } from "@/schemas/comment";

import { getArticleById, getArticleComments, postComment } from "@/api/article";

import { errorQueueContext } from "@/context/errorQueue";
import { loadingContext } from "@/context/loading";

import defaultAvatar from "@/assets/default_avatar.svg";

import styles from "./index.module.scss";

export default function ArticlePage(): ReactNode {
    const {
        articleId
    } = useParams();

    const [commentText, setCommentText] = useState<string>("");
    const [authorVisibility, setAuthorVisibility] = useState<0 | 1 | 2 | 3>(0);

    const [article, setArticle] = useState<Article>();
    const [comments, setComments] = useState<Comment[]>([]);

    const { addError } = useContext(errorQueueContext);
    const { useLoading } = useContext(loadingContext);

    const navigate = useNavigate();

    if (!articleId) {
        navigate("/");
        return undefined;
    }

    const postNewComment = () => {
        useLoading(postComment(
            articleId,
            commentText,
            authorVisibility
        ).then(c => {
            setComments([...comments, c]);
            setCommentText("");
        }).catch(addError));
    }

    useEffect(() => {
        useLoading(Promise.all([
            getArticleComments(articleId).then(setComments).catch(addError),
            getArticleById(articleId).then(setArticle).catch(addError),
        ]));
    }, [articleId]);

    if (!article) return undefined;

    return <div className={styles.article}>
        <div className={styles.title}>
            <div className={styles.category}>
                <img />
                <div className={styles.categoryInfo}>
                    <div className={styles.categoryName}>{article.category_name}</div>
                    <div className={styles.authorName}>{article.author_name}</div>
                </div>
            </div>
            <h1>{article.title}</h1>
        </div>
        <div className={styles.context}>
            {article.content}
        </div>
        <hr />
        <div className={styles.comments}>
            <div className={styles.commentInput}>
                <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="發表留言..."
                />
                <div className={styles.buttonBar}>
                    <div
                        className={styles.authorVisibility}
                        data-selected={authorVisibility}
                    >
                        <button
                            className={styles.option}
                            onClick={() => setAuthorVisibility(0)}
                        >匿名</button>
                        <button
                            className={styles.option}
                            onClick={() => setAuthorVisibility(1)}
                        >顯示使用者名稱</button>
                        <button
                            className={styles.option}
                            onClick={() => setAuthorVisibility(2)}
                        >顯示部門</button>
                        <button
                            className={styles.option}
                            onClick={() => setAuthorVisibility(3)}
                        >顯示全部</button>
                    </div>
                    <button
                        onClick={postNewComment}
                        disabled={!commentText}
                    >發布</button>
                </div>
            </div>
            <div className={styles.commentTitle}>
                留言區
            </div>
            {
                comments.map(c => <div
                    className={styles.comment}
                >
                    <div className={styles.author}>
                        <img src={defaultAvatar} />
                        <div>{c.author_name}</div>
                    </div>
                    <div className={styles.commentContent}>
                        {c.content}
                    </div>
                </div>)
            }
            <div className={styles.bottom}>
                <div>已經到底了~</div>
            </div>
        </div>
    </div>
}