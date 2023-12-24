const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "viaduct.proxy.rlwy.net",
  database: "railway",
  password: "D11Af*fGa*g5Eg3D1*Dd*536c53C5CgA",
  port: 58552,
});

module.exports = pool;
