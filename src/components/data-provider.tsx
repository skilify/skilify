import { PropsWithChildren, createContext } from "react";
import type { User } from "@/app/api/profile/[slug]/route";
import useSWR from "swr";

export const ProfileContext = createContext<User | undefined>(undefined);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ProfileWrapper = ({ children }: PropsWithChildren) => {
    const { data, error } = useSWR<{ user: User }>(`/api/profile/me`, fetcher);
    if (data && data.user) {
        return (
            <ProfileContext.Provider value={data.user}>
                {children}
            </ProfileContext.Provider>
        );
    } else {
        return children;
    }
};
