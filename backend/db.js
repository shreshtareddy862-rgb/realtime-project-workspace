const { Pool } = require("pg");

const pool = new Pool({
  user: "shreshtareddy",
  host: "localhost",
  database: "workspace_db",
  password: "",
  port: 5432,
});

module.exports = pool;