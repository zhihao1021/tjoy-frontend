import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

import defaultAvatar from "@/assets/default_avatar.svg";
import logo from "@/assets/logo.svg";

import styles from "./index.module.scss";

export default function TopBar(): ReactNode {
    const [search, setSearch] = useState<string>("");

    const { pathname } = useLocation();

    return <div className={styles.topBar}>
        <div className={styles.content}>
            <Link to="/" className={styles.logo}>
                <img
                    alt="Logo"
                    src={logo}
                />
            </Link>
            <div className={styles.searchBar}>
                <span className={`ms-nf ${styles.icon}`}>search</span>
                <label>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </label>
            </div>

            <div className={styles.functions}>
                <Link
                    to="/"
                    className="ms"
                    data-current={pathname === "/"}
                >other_houses</Link>
                <Link
                    to="/post"
                    className="ms"
                    data-current={pathname.startsWith("/post")}
                >add</Link>
                <Link
                    to="/chat"
                    className="ms"
                    data-current={pathname.startsWith("/chat")}
                >chat_bubble</Link>
                <Link
                    to="/notifications"
                    className="ms"
                    data-current={pathname.startsWith("/notifications")}
                >notifications</Link>
                <div className={styles.userInfo}>
                    <span className={styles.name}>ABC</span>
                    <img alt="avatar" src={defaultAvatar} />
                </div>
            </div>
        </div>
    </div>
}