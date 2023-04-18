const axios = require("axios");
const body = { test: "test" };
axios
  .post("https://wms-api-beta.sta.kolonfnc.com/api/account", body)
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    console.log(res);
    console.log("성공");
  })
  .catch((err) => {
    console.error("에러발생");
    console.error(err);
  });
