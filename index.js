const express = require("express");
const bodyParser = require("body-parser");
const register = require("./src/register");
const login = require("./src/login");
const votePokemon = require("./src/votePokemon");
const app = express();
const PORT = process.env.PORT || 8080;
const auth = require("./middleware/auth");
const getScorePokemon = require("./src/getScorePokemon");
const cors = require("cors");
app.use(bodyParser.json()); //ใช้บอกว่าเราจะรับ body เข้ามาเป็น json

app.use(cors());
// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow_Origin", "*"); //ใน project จริงเข้าต้อง ALlow เฉพาะ Host ที่เราเป็นคน provide
//   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
//   res.header(
//     "Access-Control-Allow-Header",
//     "Origin,X-Requested-With,Content-Type,Accept,x-access-tokeon,x-refresh-token,_id"
//   );
//   res.header("Access-Control-Expose-Headers", "x-access-token,x-refresh-token");
//   next();
// });

app.listen(PORT, () => console.log(`server is running on ${PORT}`));

app.get("/hello", async (req, res) => {
  res.json("Hello Weeeee-Stride");
});

app.post("/register", async (req, res) => {
  register(req, res);
});

app.post("/login", async (req, res) => {
  login(req, res);
});

app.post("/pokemon/vote", auth, async (req, res) => {
  votePokemon(req, res);
});

app.get("/pokemon/score/all", auth, async (req, res) => {
  getScorePokemon(req, res);
});
