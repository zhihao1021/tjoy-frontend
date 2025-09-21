import { createContext } from "react";

export const searchContext = createContext<{
    searchText: string;
}>({
    searchText: "",
});
