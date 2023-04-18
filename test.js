import axios from 'axios';

axios
  .get('https://wms-api-beta.sta.kolonfnc.com/api/account')
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
    console.log('성공');
  })
  .catch((err) => {
    console.error('에러발생');
    console.error(err);
  });
