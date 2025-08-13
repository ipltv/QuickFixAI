// db/knexfile.cjs.d.ts
declare module "./knexfile.cjs" {
  import type { Knex } from "knex";
  const knexConfig: Knex.Config;
  export = knexConfig;
}
