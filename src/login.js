const pool = require("../db/pool");
const common = require("./common/common");
const exec = async (req, res) => {
  let client = await pool.connect();
  let responseData = {};

  try {
    let data = req.body; // รับ username,password เข้ามา

    let sql = `SELECT * FROM public.user WHERE user_name = $1`;
    let param = [data.userName];
    let responseUser = await pool.query(sql, param);
    console.log("responseUser >>>", responseUser);
    console.log("<<<<");
    if (responseUser.rowCount < 1) {
      responseData.success = false;
      responseData.data = "user not found";
    } else if (!responseUser.rowCount < 1) {
      let decryptedPwd = await common.commonService.decrypted(
        //เรียกใช้งานการ decrypted จาก common
        responseUser.rows[0].password
      );

      if (decryptedPwd == data.password) {
        //เช็ค password ที่เข้ามาว่าตรงกับ password ใน database ไหม
        let tokenObj = { user_id: responseUser.rows[0].user_uuid };
        responseData.success = true;
        responseData.data = responseUser.rows.map((i) => ({
          id: i.user_uuid,
          firstName: i.first_name,
          lastName: i.last_name,
          userName: i.user_name,
        }));
        responseData._token = await common.commonService.generateToken(
          tokenObj
        );
      } else {
        console.log(decryptedPwd, "  ", data.password);
        responseData.success = false;
        responseData.data = "password invalid";
      }
    }
  } catch (error) {
    console.log(error);
    responseData.success = false;
  } finally {
    client.release();
  }

  res.status(200).send(responseData);
  return res.end();
};

module.exports = exec;
