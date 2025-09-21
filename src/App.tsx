import type { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState, type Context, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import type { User } from "./schemas/user";

import { refresh } from "./api/auth";
import { getCurrentUser } from "./api/user";

import { errorQueueContext } from "./context/errorQueue";
import { loadingContext } from "./context/loading";
import { userDataContext } from "./context/userData";

import TopBar from "@/components/TopBar";

import ChatPage from "./views/Chat";
import CreateArticlePage from "./views/CreateArticle";
import ErrorPage from "./views/Error";
import LoadingPage from "./views/Loading";
import LoginPage from "./views/Login";
import ArticleList from "./views/ArticleList";
import { searchContext } from "./context/searchContext";
import AnalysisPage from "./views/Analysis";

type ContextTuple<T extends Context<any>[]> = {
    [K in keyof T]: {
        context: React.Context<T[K]>;
        value: T[K];
    };
};

function ContextWrapper<T extends any[]>(props: Readonly<{
    contexts: ContextTuple<T>,
    children: ReactNode;
}>): ReactNode {
    const { contexts, children } = props;

    return contexts.reduceRight((children, { context, value }) => {
        return <context.Provider value={value}>{children}</context.Provider>;
    }, children);
}

export default function App(): ReactNode {
    const [userData, setUserData] = useState<User | null | undefined>(undefined);
    const [globalSearch, setGlobalSearch] = useState<string>("");

    const [errorQueue, setErrorQueue] = useState<{
        error: Error | string;
        stamp: string;
    }[]>([]);

    const [loadingCount, setLoadingCount] = useState<number>(1);

    const setLoading = useCallback((loading?: boolean) => {
        setLoadingCount(v => v + (loading ? 1 : -1));
    }, []);

    const useLoading = useCallback((promiseOrFunc: (() => Promise<any>) | (Promise<any>)) => {
        setLoading(true);

        return ("then" in promiseOrFunc ? promiseOrFunc : promiseOrFunc()).finally(
            () => setLoading(false)
        );
    }, [setLoading]);

    const { pathname } = useLocation();

    const addError = useCallback((error: Error | string) => {
        setErrorQueue(prev => [...prev, {
            error: error,
            stamp: `${Date.now()} ${Math.random()}`,
        }]);
    }, []);

    const refreshUserData = useCallback(() => {
        setLoading(true);

        return getCurrentUser().then(
            setUserData
        ).catch((error: AxiosError) => {
            const status = error.response?.status;
            if (status === 401 || status === 403) setUserData(null);
            else {
                addError(error);
                setLoading(false);
            }
        }).finally(() => setLoading(false));
    }, [setLoading, addError]);

    useEffect(() => {
        refreshUserData();
    }, [refreshUserData]);

    useEffect(() => {
        if (userData === undefined) return;
        if (userData === null) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("token_type");
            setLoadingCount(v => v - 1);
            return;
        }

        const token = localStorage.getItem("access_token");
        try {
            if (token) {
                const decoded: { exp: number } = jwtDecode(token);
                const remainingTime = decoded.exp - (Date.now() / 1000);
                if (remainingTime <= 3600 * 24) {
                    refresh().catch(
                        error => addError(error)
                    ).finally(() => setLoadingCount(v => v - 1));
                }
                else {
                    setLoadingCount(v => v - 1);
                }
            }
        } catch (error) {
            if (error instanceof Error) addError(error);
            setLoadingCount(v => v - 1);
        }
    }, [userData, addError]);

    return <ContextWrapper contexts={[
        { context: loadingContext, value: { setLoading, useLoading } },
        { context: errorQueueContext, value: { addError } },
        { context: userDataContext, value: { userData, refreshUserData } },
        { context: searchContext, value: { searchText: globalSearch } }
    ]}>
        <ErrorPage errorQueue={errorQueue} close={stamp => setErrorQueue(
            prev => prev.filter(item => item.stamp !== stamp)
        )} />
        <LoadingPage show={loadingCount > 0} />
        {
            !pathname.startsWith("/login") && <TopBar setGlobalSearch={setGlobalSearch} />
        }
        <Routes>
            {!userData && <Route path="/login" element={<LoginPage />} />}
            {userData === null && <Route path="*" element={<Navigate to="/login" />} />}
            {
                userData && <>
                    {
                        userData.username === "admin" ? <>
                            <Route path="/analysis" element={<AnalysisPage />} />
                            <Route path="*" element={<Navigate to="/analysis" />} />
                        </> : <>
                            <Route path="/" element={<ArticleList />} />
                            <Route path="/post" element={<CreateArticlePage />} />
                            <Route path="/chat/:conversationId?" element={<ChatPage />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    }
                </>
            }
        </Routes>
    </ContextWrapper>
}