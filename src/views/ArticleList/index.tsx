import { useContext, useEffect, useState, type ReactNode } from "react";

import type { Article } from "@/schemas/article";
import type { Category } from "@/schemas/category";

import { getArticleList } from "@/api/article";
import { getAllCategories } from "@/api/category";

import { errorQueueContext } from "@/context/errorQueue";
import { loadingContext } from "@/context/loading";
import { searchContext } from "@/context/searchContext";

import styles from "./index.module.scss";
import { Link } from "react-router-dom";

const eventDayMap = ["一", "二", "三", "四", "五", "六", "日"];

export default function ArticleList(): ReactNode {
    const [categories, setCategories] = useState<Category[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [tab, setTab] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const { addError } = useContext(errorQueueContext)
    const { useLoading } = useContext(loadingContext);
    const { searchText } = useContext(searchContext);



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

        if (searchText.trim()) {
            result = result.filter(a => {
                if (a.id === searchText) return true;
                if (a.title.includes(searchText)) return true;
                if (a.content.includes(searchText)) return true;
                if (a.author_id && a.author_id === searchText) return true;
                if (a.author_name.includes(searchText)) return true;
                if (a.category_name?.includes(searchText)) return true;
                return false;
            });
        }

        return result;
    })()

    useEffect(() => {
        useLoading(Promise.all([
            getAllCategories().then(
                setCategories
            ).catch(addError),
            getArticleList().then(articles => {
                setArticles(articles.sort((a, b) => {
                    const idA = BigInt(a.id);
                    const idB = BigInt(b.id);

                    return idB > idA ? 1 : (idB < idA ? -1 : 0);
                }));
            }).catch(addError)
        ]));
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
                displayArticles.map(a => <Link
                    key={a.id}
                    className={styles.article}
                    to={`/article/${a.id}`}
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
                    {
                        a.is_event && <div className={styles.eventInfo}>
                            {
                                a.event_week_day !== null ? <div className={styles.eventDay}>
                                    <div className={styles.value}>每周{
                                        eventDayMap[a.event_week_day]
                                    }</div>
                                </div> : undefined
                            }
                            {
                                a.event_number_min !== null && a.event_number_max !== null ? <div className={styles.eventNumber}>
                                    <div className={styles.value}>{
                                        `${a.event_number_min} ~ ${a.event_number_max} 人`
                                    }</div>
                                </div> : undefined
                            }
                        </div>
                    }
                </Link>)
            }
        </div>
    </div>
}