import { createContext } from "react";

import type { User } from "@/schemas/user";

export const userDataContext = createContext<{
    userData: User | null | undefined;
    refreshUserData: () => Promise<void>;
}>({
    userData: undefined,
    refreshUserData: () => Promise.resolve(),
});
