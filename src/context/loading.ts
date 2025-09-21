import { createContext } from "react";

export const loadingContext = createContext<{
    setLoading: (loading: boolean) => void;
    useLoading: (func: (() => Promise<any>) | (Promise<any>)) => Promise<void>;
}>({
    setLoading: () => { },
    useLoading: () => Promise.resolve(),
});
