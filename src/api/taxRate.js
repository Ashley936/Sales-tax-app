import axios from "axios";

export default axios.create({
  baseURL: "https://sandbox-rest.avatax.com/api/v2/taxrates",
  headers: {
    Authorization: "Basic bmFtaXRhcmFzdG9naW13bkBnbWFpbC5jb206TmFtaXRhQDE5MDc=",
  },
});
