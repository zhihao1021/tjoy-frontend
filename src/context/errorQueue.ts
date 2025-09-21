import { createContext } from "react";

export const errorQueueContext = createContext<{
    addError: (error: Error | string) => void;
}>({
    addError: () => { }
});
