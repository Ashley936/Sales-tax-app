import axios from "axios";
var res = await axios.get(
  "https://www.universal-tutorial.com/api/getaccesstoken",
  {
    headers: {
      "api-token":
        "PHnL7risX90vg4ZDn8TK4GoPCaJpwqDBgiXk9NojkDc7JsVbN9fMvPwVJvxqxH2nyDU",
      "user-email": "namitarastogimwn@gmail.com",
    },
  }
);
console.log(res);
