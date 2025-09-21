import type { CSSProperties, ReactNode } from "react";

import styles from "./index.module.scss";

export default function LoadingPage(props: Readonly<{
    show: boolean
}>): ReactNode {
    const { show } = props;

    return <div className={styles.loadingPage} data-show={show}>
        <div className={styles.loadingBox}>{
            Array.from({ length: 12 }, (_, index) => <div
                key={index}
                className={styles.loadingDot}
                style={{ "--index": index } as CSSProperties}
            />)
        }</div>
    </div>
}