import { useContext, useEffect, useState, type CSSProperties, type ReactNode } from "react";

import styles from "./index.module.scss";
import { loadingContext } from "@/context/loading";
import { errorQueueContext } from "@/context/errorQueue";
import { createArticle } from "@/api/article";
import type { Category } from "@/schemas/category";
import { getAllCategories } from "@/api/category";
import { useNavigate } from "react-router-dom";

export default function CreateArticlePage(): ReactNode {
    const [title, setTitle] = useState<string>("");
    const [authorVisibility, setAuthorVisibility] = useState<0 | 1 | 2 | 3>(0);
    const [context, setContext] = useState<string>("");
    const [eventWeekDay, setEventWeekDay] = useState<string>("0");
    const [eventNumberMin, setEventNumberMin] = useState<string>("1");
    const [eventNumberMax, setEventNumberMax] = useState<string>("10");
    const [categories, setCategories] = useState<Category[]>([]);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const [tab, setTab] = useState<0 | 1>(0);

    const { useLoading } = useContext(loadingContext);
    const { addError } = useContext(errorQueueContext);

    const navigate = useNavigate();

    const canSubmit = (() => {
        if (!title.trim() || !context.trim()) return false;
        if (tab === 1) {
            if (!eventWeekDay.trim() || !eventNumberMin.trim() || !eventNumberMax.trim()) {
                return false;
            }
            if (isNaN(parseInt(eventWeekDay)) || isNaN(parseInt(eventNumberMin)) || isNaN(parseInt(eventNumberMax))) {
                return false;
            }
            if (parseInt(eventNumberMin) > parseInt(eventNumberMax)) return false;
        }
        return true;
    })()

    const submit = () => {
        if (!canSubmit) return;

        useLoading(createArticle({
            author_visibility: authorVisibility,
            category_id: selectedCategory,
            title: title,
            content: context,
            tags: "",
            is_public: true,
            is_event: tab === 1,
            event_week_day: tab === 1 ? parseInt(eventWeekDay) : undefined,
            event_number_min: tab === 1 ? parseInt(eventNumberMin) : undefined,
            event_number_max: tab === 1 ? parseInt(eventNumberMax) : undefined,
        }).then(() => navigate("/")).catch(addError));
    }

    useEffect(() => {
        useLoading(getAllCategories().then(setCategories).catch(addError));
    }, [useLoading, addError]);

    return <div className={styles.create}>
        <div className={styles.categories} data-show={showCategories}>
            <div className={styles.box}>
                <div className={styles.categoriesTitle}>要發佈在哪裡</div>
                <div className={styles.categoriesList}>
                    {
                        categories.map(c => <button
                            key={c.id}
                            onClick={() => setSelectedCategory(c.id)}
                            data-selected={c.id === selectedCategory}
                        >{c.name}</button>)
                    }
                </div>
                <div className={styles.functionBar}>
                    <button
                        onClick={() => { if (canSubmit && selectedCategory) submit() }}
                        disabled={!canSubmit || !selectedCategory}
                        className={styles.publish}
                    >發布</button>
                </div>
            </div>
        </div>
        <div className={styles.tab} data-selected={tab}>
            <button
                onClick={() => setTab(0)}
            >文章</button>
            <button
                onClick={() => setTab(1)}
            >發起活動</button>
        </div>
        <div className={styles.inputField}>
            <div className={styles.key}>{tab === 0 ? "文章標題" : "活動標題"}</div>
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={tab === 0 ? "請輸入文章標題" : "請輸入活動標題"}
            />
        </div>
        <div className={styles.inputField}>
            <div className={styles.key}>顯示名稱</div>
            <div
                className={`${styles.options} ${styles.authorVisibility}`}
                data-selected={authorVisibility}
            >
                <button
                    onClick={() => setAuthorVisibility(0)}
                    data-selected={authorVisibility === 0}
                >匿名</button>
                <button
                    onClick={() => setAuthorVisibility(1)}
                    data-selected={authorVisibility === 1}
                >顯示使用者名稱</button>
                <button
                    onClick={() => setAuthorVisibility(2)}
                    data-selected={authorVisibility === 2}
                >顯示部門</button>
                <button
                    onClick={() => setAuthorVisibility(3)}
                    data-selected={authorVisibility === 3}
                >顯示全部</button>
            </div>
        </div>
        <div className={styles.inputField}>
            <div
                className={styles.key}
            >{tab === 0 ? "文章內容" : "活動內容"}</div>
            <textarea
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder={tab === 0 ? "請輸入文章內容" : "請輸入活動內容"}
            />
        </div>
        {
            tab === 1 && <>
                <div className={styles.inputField}>
                    <div
                        className={styles.key}
                    >活動日</div>
                    <div
                        className={`${styles.options} ${styles.weekDay}`}
                        data-selected={authorVisibility}
                        style={{
                            "--selected": isNaN(parseInt(eventWeekDay)) ? 0 : parseInt(eventWeekDay)
                        } as CSSProperties}
                    >
                        <button
                            onClick={() => setEventWeekDay("0")}
                            data-selected={eventWeekDay === "0"}
                        >一</button>
                        <button
                            onClick={() => setEventWeekDay("1")}
                            data-selected={eventWeekDay === "1"}
                        >二</button>
                        <button
                            onClick={() => setEventWeekDay("2")}
                            data-selected={eventWeekDay === "2"}
                        >三</button>
                        <button
                            onClick={() => setEventWeekDay("3")}
                            data-selected={eventWeekDay === "3"}
                        >四</button>
                        <button
                            onClick={() => setEventWeekDay("4")}
                            data-selected={eventWeekDay === "4"}
                        >五</button>
                        <button
                            onClick={() => setEventWeekDay("5")}
                            data-selected={eventWeekDay === "5"}
                        >六</button>
                        <button
                            onClick={() => setEventWeekDay("6")}
                            data-selected={eventWeekDay === "6"}
                        >日</button>
                    </div>
                </div>
                <div className={`${styles.inputField} ${styles.doubleInput}`}>
                    <div className={styles.key}>活動人數</div>
                    <input
                        type="number"
                        value={eventNumberMin}
                        onChange={e => setEventNumberMin(e.target.value)}
                    />
                    <div>至</div>
                    <input
                        type="number"
                        value={eventNumberMax}
                        onChange={e => setEventNumberMax(e.target.value)}
                    />
                    <div>人</div>
                </div>
            </>
        }
        <div className={styles.functionBar}>
            <button
                onClick={() => { if (canSubmit) setShowCategories(true) }}
                disabled={!canSubmit}
            >發布</button>
        </div>
    </div>
}