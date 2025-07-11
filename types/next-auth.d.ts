import { UserRole } from "@prisma/client";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {

    interface Session {
        user: {
            id: number;
            role: string;

        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: number;
        role: string;
    }

    declare module "next-auth/jwt" {
        interface JWT extends DefaultJWT {
            id: number;
            role: string;
        }
    }
}