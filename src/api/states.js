import axios from "axios";

export default axios.create({
  baseURL: "https://parseapi.back4app.com/classes",
  headers: {
    "X-Parse-Application-Id": "6ihfQBXizl3p49w9dbf3TKOiAkK2yfqYgrwFunn1", // This is your app's application id
    "X-Parse-REST-API-Key": "gj0746Jm60nqX2PbJ2izJAz06Ma5Hc5G9Q3UgQ9K", // This is your app's REST API key
  },
});
