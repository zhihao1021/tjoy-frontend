import { useContext, useEffect, useState, type ReactNode } from "react";

import type { Article } from "@/schemas/article";
import type { Category } from "@/schemas/category";

import { getArticleList } from "@/api/article";
import { getAllCategories } from "@/api/category";

import { errorQueueContext } from "@/context/errorQueue";
import { loadingContext } from "@/context/loading";

import styles from "./index.module.scss";


export default function ArticleList(): ReactNode {
    const [categories, setCategories] = useState<Category[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [tab, setTab] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const { useLoading } = useContext(loadingContext);
    const { addError } = useContext(errorQueueContext)


    const displayArticles = (() => {
        let result = articles;

        if (tab === 1) {
            result = result.filter(a => !a.is_event);
        } else if (tab === 2) {
            result = result.filter(a => a.is_event);
        }

        if (selectedCategory) {
            result = result.filter(a => a.category_id === selectedCategory);
        }

        return result;
    })()

    useEffect(() => {
        useLoading(getAllCategories().then(
            setCategories
        ).catch(addError));
        useLoading(getArticleList().then(articles => {
            setArticles(articles.sort((a, b) => {
                const idA = BigInt(a.id);
                const idB = BigInt(b.id);

                return idB > idA ? 1 : (idB < idA ? -1 : 0);
            }));
        }).catch(addError));
    }, [useLoading, addError]);

    return <div className={styles.articles}>
        <div className={styles.categories}>
            {
                categories.map(c => <button
                    key={c.id}
                    className={styles.category}
                    data-on-selected={c.id === selectedCategory}
                    onClick={() => setSelectedCategory(c.id === selectedCategory ? "" : c.id)}
                >
                    {c.name}
                </button>)
            }
        </div>
        <div className={styles.list}>
            <div className={styles.tab} data-tab={tab}>
                <button
                    onClick={() => setTab(0)}
                >全部</button>
                <button
                    onClick={() => setTab(1)}
                >文章</button>
                <button
                    onClick={() => setTab(2)}
                >活動</button>
            </div>
            {
                displayArticles.map(a => <div
                    key={a.id}
                    className={styles.article}
                >
                    <div
                        className={styles.articleCategorues}
                    >
                        <img src="" />
                        <div className={styles.authorInfo}>
                            <div
                                className={styles.categoryName}
                            >{a.category_name}</div>
                            <div
                                className={styles.authorName}
                            >{a.author_name}</div>
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.title}>{a.title}</div>
                        <div className={styles.brief}>{a.content.slice(0, 30)}</div>
                    </div>
                </div>)
            }
        </div>
    </div>
}