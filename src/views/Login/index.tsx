import { useContext, useEffect, useState, type ReactNode } from "react";

import backgrond1 from "@/assets/login/background_1.svg"
import backgrond2 from "@/assets/login/background_2.svg"

import styles from "./index.module.scss";
import { login, preCheck, register } from "@/api/auth";
import { loadingContext } from "@/context/loading";
import { userDataContext } from "@/context/userData";
import { useNavigate } from "react-router-dom";

type SectionType = "landing" | "login" | "register" | "userInfo" | "userInfo2";
const sections: SectionType[] = ["landing", "login", "register", "userInfo", "userInfo2"];

const today = new Date();

export default function LoginPage(): ReactNode {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [department, setDepartment] = useState<string>("");
    const [onBoardingYear, setOnboardingYear] = useState<string>((today.getFullYear()).toString());
    const [onBoardingMonth, setOnboardingMonth] = useState<string>((today.getMonth() + 1).toString());
    const [onBoardingDay, setOnboardingDay] = useState<string>((today.getDate()).toString());
    const [interest, setInterest] = useState<string>("");

    const [sectionIndex, setSectionIndex] = useState<number>(0);
    const section = sections[sectionIndex];

    const [error, setError] = useState<string>("");

    const { useLoading } = useContext(loadingContext);
    const { refreshUserData } = useContext(userDataContext);

    const navigate = useNavigate();

    const nextEnabled = (() => {
        switch (section) {
            case "landing":
                return username.length > 0;
            case "login":
                return password.length > 0;
            case "register":
                return password.length > 0 && password === passwordConfirm;
            case "userInfo":
                return displayName.length > 0 && department.length > 0 && gender.length > 0;
            case "userInfo2":
                const year = parseInt(onBoardingYear);
                const month = parseInt(onBoardingMonth);
                const day = parseInt(onBoardingDay);
                if (isNaN(year) || isNaN(month) || isNaN(day)) return false;

                return year > 1900 && month > 0 && month < 13 && day > 0 && day < 32;
        }
    })();

    const checkUsername = async () => {
        useLoading(preCheck(username).then(() => {
            setSectionIndex(2);
        }).catch(() => {
            setSectionIndex(1);
        }));
    }

    const loginFunc = () => {
        useLoading(login({
            username,
            password
        }).then(() => {
            refreshUserData();
            navigate("/");
        }).catch(
            () => setError("帳號或密碼錯誤")
        ));
    }

    const registerFunc = () => {
        if (!nextEnabled) return;

        useLoading(register({
            username: username,
            password: password,
            display_name: displayName,
            gender: gender,
            department: department,
            onboarding_year: parseInt(onBoardingYear),
            onboarding_month: parseInt(onBoardingMonth),
            onboarding_day: parseInt(onBoardingDay),
            interest: interest,
        }).then(() => {
            refreshUserData();
            navigate("/");
        }).catch(() => {
            setError("註冊失敗");
        }));
    }

    const next = () => {
        if (!nextEnabled) return;

        switch (section) {
            case "landing":
                checkUsername();
                break;
            case "login":
                loginFunc();
                break;
            case "register":
                setSectionIndex(3);
                break;
            case "userInfo":
                setSectionIndex(4);
                break;
            case "userInfo2":
                registerFunc();
                break;
        }
    }

    useEffect(() => {
        setError("");
    }, [section, username, password, passwordConfirm, displayName]);

    return <div className={styles.loginPage}>
        <img alt="background" src={backgrond1} />
        <img alt="background" src={backgrond2} />
        <div className={styles.box} data-section={section}>
            <h1>{section === "landing" ? "註冊/登入" : section === "login" ? "登入" : "註冊"}</h1>
            <div className={styles.forms}>
                <div
                    className={`${styles.form} ${styles.username}`}
                    data-show={!section.startsWith("userInfo")}
                >
                    <label>
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="帳號"
                            disabled={section !== "landing"}
                            onKeyDown={e => {
                                if (e.key === "Enter" && section === "landing") next();
                            }}
                        />
                    </label>
                </div>
                <div
                    className={`${styles.form} ${styles.password}`}
                    data-show={section === "login" || section === "register"}
                >
                    <label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="密碼"
                            disabled={section.startsWith("userInfo") || section === "landing"}
                            onKeyDown={e => {
                                if (e.key === "Enter" && section === "login") next();
                            }}
                        />
                    </label>
                </div>
                <div
                    className={`${styles.form} ${styles.passwordConfirm}`}
                    data-show={section === "register"}
                >
                    <label>
                        <input
                            type="password"
                            value={passwordConfirm}
                            onChange={e => setPasswordConfirm(e.target.value)}
                            placeholder="確認密碼"
                            disabled={section !== "register"}
                            onKeyDown={e => {
                                if (e.key === "Enter" && section === "register") next();
                            }}
                        />
                    </label>
                </div>
                <div
                    className={`${styles.form} ${styles.displayName}`}
                    data-show={section === "userInfo"}
                >
                    <label>
                        <input
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            placeholder="暱稱"
                            disabled={section !== "userInfo"}
                        />
                    </label>
                </div>
                <div
                    className={`${styles.form} ${styles.gender}`}
                    data-show={section === "userInfo"}
                >
                    <label>
                        <input
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                            placeholder="性別"
                            disabled={section !== "userInfo"}
                        />
                    </label>
                </div>
                <div
                    className={`${styles.form} ${styles.department}`}
                    data-show={section === "userInfo"}
                >
                    <label>
                        <input
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            placeholder="部門"
                            disabled={section !== "userInfo"}
                            onKeyDown={e => {
                                if (e.key === "Enter" && section === "userInfo") next();
                            }}
                        />
                    </label>
                </div>
                <div
                    className={`${styles.form} ${styles.onBoardingYear}`}
                    data-show={section === "userInfo2"}
                >
                    <label>
                        <input
                            type="number"
                            value={onBoardingYear}
                            onChange={e => setOnboardingYear(e.target.value)}
                            placeholder="入職年份"
                            disabled={section !== "userInfo2"}
                        />
                    </label>
                </div>
                <div
                    className={`${styles.form} ${styles.onBoardingMonth}`}
                    data-show={section === "userInfo2"}
                >
                    <label>
                        <input
                            type="number"
                            value={onBoardingMonth}
                            onChange={e => setOnboardingMonth(e.target.value)}
                            placeholder="入職月份"
                            disabled={section !== "userInfo2"}
                        />
                    </label>
                </div>
                <div
                    className={`${styles.form} ${styles.onBoardingDay}`}
                    data-show={section === "userInfo2"}
                >
                    <label>
                        <input
                            type="number"
                            value={onBoardingDay}
                            onChange={e => setOnboardingDay(e.target.value)}
                            placeholder="入職日期"
                            disabled={section !== "userInfo2"}
                        />
                    </label>
                </div>
                <div
                    className={`${styles.form} ${styles.interest}`}
                    data-show={section === "userInfo2"}
                >
                    <label>
                        <input
                            value={interest}
                            onChange={e => setInterest(e.target.value)}
                            placeholder="興趣"
                            disabled={section !== "userInfo2"}
                            onKeyDown={e => {
                                if (e.key === "Enter" && section === "userInfo2") next();
                            }}
                        />
                    </label>
                </div>
            </div>
            <div className={styles.error} data-show={error !== ""}>
                <div className={styles.context}>
                    {error}
                </div>
            </div>
            <button
                className={styles.next}
                onClick={next}
                disabled={!nextEnabled}
            >{section === "login" ? "登入" : section === "userInfo2" ? "註冊" : "下一步"}</button>
        </div>
    </div >
}