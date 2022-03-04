import axios from "axios";
import React from "react";
import states from "../api/states";
import taxRate from "../api/taxRate";

class Calculator extends React.Component {
  state = { cities: [], stateCode: "", rate: "", n: 0 };
  /* getPostalCode = async (city, stateCode) => {
    const res = await axios.get(
      `http://api.zippopotam.us/us/${stateCode}/${city}`
    );
    const place = res.data.places[0];
    const code = place["post code"];

    this.getTaxRate(code);
  }; */
  getTaxRate = (code) => {
    taxRate.get(`/bypostalcode?country=USA&postalCode=${code}`).then((res) => {
      console.log(res.data);
      this.setState({ rate: res.data.totalRate });
    });
  };
  componentDidMount() {
    let stateCode = new URLSearchParams(window.location.search).get("state");
    /*states
      .get(
        `/Usabystate_${stateCode}?limit=400&order=name&keys=adminCode,name,objectId`
      )
      .then((res) => {
        this.setState({ cities: res.data.results, stateCode });
        this.getPostalCode(res.data.results[0].name, stateCode);
      }); */

    axios
      .get(
        "https://raw.githubusercontent.com/millbj92/US-Zip-Codes-JSON/master/USCities.json"
      )
      .then((res) => {
        let cities = res.data.filter((item) => item.state === stateCode);
        this.setState({ cities });
        this.getTaxRate(cities[0].zip_code);
      });
  }
  render() {
    return (
      <div>
        <div className="city-list">
          <ol>
            {this.state.cities
              .slice(this.state.n, this.state.n + 10)
              .map((item) => (
                <li
                  key={item.objectId}
                  onClick={(e) =>
                    //this.getPostalCode(e.target.innerHTML, this.state.stateCode)
                    this.getTaxRate(
                      this.state.cities.find(
                        (item) => item.city === e.target.innerHTML
                      ).zip_code
                    )
                  }
                >
                  {item.city}
                </li>
              ))}
          </ol>
          <span>
            {" "}
            <span
              onClick={() =>
                this.state.n > 0 ? this.setState({ n: this.state.n - 10 }) : ""
              }
            >
              --
            </span>{" "}
            List More{" "}
            <span
              onClick={() =>
                this.state.n < this.state.cities.length
                  ? this.setState({ n: this.state.n + 10 })
                  : ""
              }
            >
              ++
            </span>
          </span>
        </div>
        <div className="sales-tax-form-container">
          <form action="" className="sales-tax-form">
            <input className="principal" required />
            <input
              type="number"
              value={this.state.rate}
              onChange={(e) => this.setState({ rate: e.target.value })}
              className="rate"
              required
            />
            <input className="final-amount" />
            <button>Calculate</button>
          </form>
        </div>
      </div>
    );
  }
}
export default Calculator;
