import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  datasource: {
    url: "postgresql://postgres:postgres@localhost:5432/gre1?schema=public",
  },
});
