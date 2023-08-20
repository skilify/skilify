import NextAuth from "next-auth";
import type { AuthOptions, Session } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { FirestoreAdapter, initFirestore } from "@next-auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { AdapterUser } from "next-auth/adapters";

export const firestore = initFirestore({
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
});

export const authOptions: AuthOptions = {
    adapter: FirestoreAdapter(firestore),
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({
            session,
            user,
        }: {
            session: Session;
            user: {
                bio?: string;
                tags?: string[];
                reputation?: number;
            } & AdapterUser;
        }) {
            session.user.id = user.id;
            session.user.bio = user.bio;
            session.user.tags = user.tags;
            session.user.reputation = user.reputation;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
