// token PHnL7risX90vg4ZDn8TK4GoPCaJpwqDBgiXk9NojkDc7JsVbN9fMvPwVJvxqxH2nyDU
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

ReactDOM.render(<App />, document.querySelector("#root"));
//states
//.get(`/Usabystate_${stateCode}?keys=adminCode,name,objectId`)
//.then((res) => setCities(res.data.results));
/* <div
            className="open-list"
            onClick={() => {
              let action = !this.state.showList;
              var obj = { ...this.state.expand };
              if (action) {
                for (var city in obj) {
                  obj[city] = false;
                }
              }
              this.setState({ showList: action, expand: obj });
            }}
          >
            {this.state.showList ? "SHOW" : "HIDE"} CITIES
          </div> */
