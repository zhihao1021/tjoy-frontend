import { useState, type ReactNode } from "react";

import styles from "./index.module.scss";

export default function CreateArticlePage(): ReactNode {
    const [tab, setTab] = useState<0 | 1>(0);

    return <div className={styles.create}>
        <div className={styles.tab} data-selected={tab}>
            <button
                onClick={() => setTab(0)}
            >文章</button>
            <button
                onClick={() => setTab(1)}
            >發起活動</button>
        </div>
        
    </div>
}