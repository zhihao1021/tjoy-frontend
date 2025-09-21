import { useCallback, type ReactNode } from "react";

import styles from "./index.module.scss";

type propsType = Readonly<{
    errorQueue: { error: Error | string; stamp: string }[];
    close: (stamp: string) => void;
}>;

export default function ErrorPage(props: propsType): ReactNode {
    const { errorQueue, close } = props;

    const reportBug = useCallback((error: Error) => {
        // TODO: Implement bug reporting logic
        console.error("Report bug:", error);
    }, []);

    const getErrorJson = useCallback((error: Error, format?: boolean) => {
        try {
            return JSON.stringify({ ...error }, null, format ? 2 : 0);
        }
        catch {
            return JSON.stringify(error, null, format ? 2 : 0);
        }
    }, []);

    const getEncodeString = useCallback((error: Error) => {
        try {
            return `data:text/json;charset=utf-8;base64,${btoa(getErrorJson(error))}`;
        } catch {
            return URL.createObjectURL(new Blob([getErrorJson(error)], { type: "application/json" }));
        }
    }, [getErrorJson]);

    return <>
        {
            errorQueue.map(({ error, stamp }) => <div key={stamp} className={styles.errorPage}>
                <div className={styles.errorBox}>
                    <h2 className={styles.errorTitle}>
                        <span className={`ms-nf ${styles.errorIcon}`}>warning</span>
                        <span>發生錯誤</span>
                    </h2>
                    {
                        typeof error === "string" ? <div className={styles.errorMessage}>{error}</div> : <>
                            <div className={styles.errorMessage}>{`${error?.name}: ${error?.message}`}</div>
                            <div className={styles.errorDetail}>詳細資料:</div>
                            <div className={styles.errorStack}>
                                <pre>
                                    <code>{`Error stack:\n${error?.stack}\n\nObject dump:\n${getErrorJson(error, true)}`}</code>
                                </pre>
                            </div>
                        </>
                    }
                    <div className={styles.errorActions}>
                        {typeof error === "object" && <>
                            <a
                                className={styles.downloadReport}
                                download={`error-${stamp}.json`}
                                href={getEncodeString(error)}
                            >
                                <span className={`ms-nf ${styles.icon}`}>download</span>
                                <span>下載報告</span>
                            </a>
                            <button className={styles.report} onClick={() => reportBug(error)}>
                                <span className={`ms-nf ${styles.icon}`}>bug_report</span>
                                <span>回報問題</span>
                            </button>
                        </>}
                        <button className={styles.close} onClick={() => close(stamp)}>
                            <span className={`ms-nf ${styles.icon}`}>close</span>
                            <span>關閉</span>
                        </button>
                    </div>
                </div>
            </div>)
        }
    </>
};