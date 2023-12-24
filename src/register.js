const pool = require("../db/pool");
const { uuid } = require("uuidv4");
const common = require("./common/common");
const exec = async (req, res) => {
  let client = await pool.connect();
  await client.query("BEGIN");
  let responseData = {};
  try {
    let data = req.body;
    console.log(data, "<<<< body");

    let sqlUser = `SELECT * FROM public.user WHERE user_name = $1`; //$1 คือแทนค่าตัวแปล prepare statement เพราะ ถ้าแทนค่าโดยตรงอาจมีการหวังร้าย
    let paramUser = [data.userName];
    let responseUser = await pool.query(sqlUser, paramUser);
    console.log(responseUser);

    if (responseUser.rowCount > 0) {
      responseData.success = false;
      responseData.data = "user duplicate";
    } else {
      let user_uuid = uuid();
      let encryptPwd = await common.commonService.encrypted(data.password);
      let sql = `INSERT INTO public."user"
(user_uuid, first_name, last_name, user_name, "password", create_data, create_by)
VALUES($1, $2, $3, $4, $5, now(), $6);`;
      let param = [
        user_uuid,
        data.firstName,
        data.lastName,
        data.userName,
        encryptPwd,
        user_uuid,
      ];
      let response = await pool.query(sql, param);
      console.log(response);
      responseData.success = true;
      client.query("COMMIT");
    }
  } catch (error) {
    client.query("ROLLBACK");
    responseData.success = false;
    console.log(error);
  } finally {
    client.release();
  }
  res.status(200).send(responseData);
  return res.end();
};
module.exports = exec;
