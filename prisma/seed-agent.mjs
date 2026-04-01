import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
  "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

try {
  const agent = await prisma.agent.create({
    data: {
      nombre: "Agente Demo",
      email: "agente1@terranova.es",
      passwordHash:
        "17f80754644d33ac685b0842a402229adbb43fc9312f7bdf36ba24237a1f1ffb",
      rol: "ADMIN",
      activo: true,
    },
  });
  console.log("Usuario creado:", agent);
} catch (e) {
  if (e.code === "P2002") {
    console.log("El usuario agente1@terranova.es ya existe.");
  } else {
    console.error(e);
    process.exit(1);
  }
} finally {
  await prisma.$disconnect();
}
