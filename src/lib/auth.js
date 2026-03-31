import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";

async function verifyPassword(plain, hash) {
  const { createHash } = await import("node:crypto");
  const computed = createHash("sha256").update(plain).digest("hex");
  return computed === hash;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Email & Contraseña",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const agent = await prisma.agent.findUnique({
          where: { email: credentials.email },
        });

        if (!agent || !agent.activo) return null;

        const isValid = await verifyPassword(
          credentials.password,
          agent.passwordHash
        );
        if (!isValid) return null;

        return {
          id: agent.id,
          name: agent.nombre,
          email: agent.email,
          role: agent.rol,
        };
      },
    }),
  ],
});
