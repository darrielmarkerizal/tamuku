import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Runtime queries via PgBouncer (port 6432)
    url: process.env["DATABASE_URL"],
    // Migrations bypass PgBouncer, langsung ke PostgreSQL (port 5432)
    directUrl: process.env["DIRECT_URL"],
  },
});
