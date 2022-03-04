import axios from "axios";
import React from "react";
import taxRate from "../api/taxRate";

class Calculator extends React.Component {
  state = {
    cities: [],
    selectedCity: "",
    stateCode: "",
    rate: "",
    principal: "",
    finalAmount: "",
    n: 0,
    expand: {},
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

        this.setState({ cities, selectedCity: cities[0] });
        this.getTaxRate(cities[0].zip_code);
      });
  }

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

  getPincodes = (cityName) => {
    return this.state.cities
      .filter((item) => item.city === cityName)
      .map((item) => item.zip_code);
  };
  unique(array, propertyName) {
    return array.filter(
      (e, i) =>
        array.findIndex((a) => a[propertyName] === e[propertyName]) === i
    );
  }
  setInnerHtml = (codes, city) => {
    return (
      <div>
        <span>&#9650;</span>
        <ul>
          {codes.map((item) => (
            <li
              onClick={(e) => {
                this.setState({ selectedCity: city });
                this.getTaxRate(item);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let finalAmount =
      parseFloat(this.state.principal) + this.state.principal * this.state.rate;
    this.setState({ finalAmount });
  };
  render() {
    return (
      <div style={{ display: "flex" }}>
        <div className="city-list">
          <ol>
            {this.unique(this.state.cities, "city")
              .slice(this.state.n, this.state.n + 10)
              .map((item) => (
                <li key={this.state.cities.longitude}>
                  <div
                    onClick={(e) =>
                      //this.getPostalCode(e.target.innerHTML, this.state.stateCode)
                      {
                        this.setState({ selectedCity: item });
                        this.getTaxRate(
                          this.state.cities.find(
                            (item) => item.city === e.target.innerHTML
                          ).zip_code
                        );
                      }
                    }
                  >
                    {item.city}
                  </div>
                  <div
                    onClick={(e) => {
                      var obj = { ...this.state.expand };

                      this.state.expand[item.city]
                        ? (obj[item.city] = false)
                        : (obj[item.city] = true);
                      this.setState({ expand: obj });
                    }}
                  >
                    {this.state.expand[item.city] ? (
                      this.setInnerHtml(this.getPincodes(item.city), item)
                    ) : (
                      <span>&#9660;</span>
                    )}
                  </div>
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
          <h1>SALES TAX CALCULATOR</h1>
          <form action="" className="sales-tax-form">
            <h3>amount</h3>
            <input
              type="number"
              value={this.state.principal}
              onChange={(e) => this.setState({ principal: e.target.value })}
              className="principal"
              required
            />
            <h3>Sales tax rate</h3>
            <input
              type="number"
              value={this.state.rate}
              onChange={(e) => this.setState({ rate: e.target.value })}
              className="rate"
              required
            />
            <h3>Final Amount</h3>
            <input
              value={this.state.finalAmount}
              className="final-amount"
              readOnly
            />
            <button onClick={(e) => this.handleSubmit(e)}>Calculate</button>
          </form>
        </div>
      </div>
    );
  }
}
export default Calculator;
