import React from "react";
import { useParams } from "react-router-dom";

import taxRate from "../api/taxRate";
import "../calculator.css";

function withRouter(Children) {
  return (props) => {
    const match = { params: useParams() };
    return <Children {...props} match={match} />;
  };
}

class Calculator extends React.Component {
  state = {
    cities: [],
    selectedCity: {},
    stateCode: "",
    rate: "",
    principal: "",
    finalAmount: "",
    n: 0,
    expand: {},
  };
  componentDidMount() {
    let stateCode = this.props.match.params.state;
    let selectedCity = this.props.match.params.city;
    let cityCode = this.props.match.params.zip_code;
    /*states
      .get(
        `/Usabystate_${stateCode}?limit=400&order=name&keys=adminCode,name,objectId`
      )
      .then((res) => {
        this.setState({ cities: res.data.results, stateCode });
        this.getPostalCode(res.data.results[0].name, stateCode);
      }); */
    let cities = this.props.cities.filter((item) => item.state === stateCode);
    if (!selectedCity) {
      selectedCity = cities[0];
      console.log("in");
    } else {
      selectedCity = this.props.cities.filter(
        (item) =>
          item.city === selectedCity && item.zip_code === parseInt(cityCode)
      )[0];
    }
    this.setState({ cities, selectedCity });
    this.getTaxRate(selectedCity.zip_code);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.zip_code !== this.props.match.params.zip_code) {
      let newCity = this.props.cities.filter(
        (item) => item.zip_code === parseInt(this.props.match.params.zip_code)
      )[0];

      this.setState({
        selectedCity: newCity,
      });
      this.getTaxRate(newCity.zip_code);
    }
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
    code = code.toString();
    while (code.length !== 5) {
      code = "0" + code;
    }
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
      <ul className="sub-list">
        {codes.map((item) => (
          <li
            key={item}
            onClick={(e) => {
              this.setState({ selectedCity: city });
              this.getTaxRate(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
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
      <div className="side-page-container">
        <div className="city-list">
          <ol>
            {this.unique(this.state.cities, "city")
              .slice(this.state.n, this.state.n + 10)
              .map((item) => (
                <li
                  className="main-list-item"
                  key={this.state.cities.longitude}
                >
                  <div
                    className="list-item-name"
                    onClick={(e) =>
                      //this.getPostalCode(e.target.innerHTML, this.state.stateCode)
                      {
                        this.setState({ selectedCity: item });
                        this.getTaxRate(
                          this.state.cities.find(
                            (place) => place.city === item.city
                          ).zip_code
                        );
                      }
                    }
                  >
                    {item.city}
                    <div
                      className="min-max-icon"
                      onClick={(e) => {
                        var obj = { ...this.state.expand };

                        this.state.expand[item.city]
                          ? (obj[item.city] = false)
                          : (obj[item.city] = true);
                        this.setState({ expand: obj });
                      }}
                    >
                      {this.state.expand[item.city] ? (
                        <span>&#9650;</span>
                      ) : (
                        <span>&#9660;</span>
                      )}
                    </div>
                  </div>

                  {this.state.expand[item.city]
                    ? this.setInnerHtml(this.getPincodes(item.city), item)
                    : ""}
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
          <h1>
            <span>S</span>ales <span>T</span>ax for{" "}
            {this.state.selectedCity.city}:
          </h1>
          <form action="" className="sales-tax-form">
            <div>
              <input
                placeholder="principal"
                type="number"
                value={this.state.principal}
                onChange={(e) => this.setState({ principal: e.target.value })}
                className="principal"
                required
              />
            </div>
            <div>
              <input
                placeholder="tax-rate"
                type="number"
                value={this.state.rate}
                onChange={(e) => this.setState({ rate: e.target.value })}
                className="rate"
                required
              />
            </div>
            <div>
              <input
                placeholder="final-amount"
                value={this.state.finalAmount}
                className="final-amount"
                readOnly
              />
            </div>
            <div>
              <button
                className="calculate-btn"
                onClick={(e) => this.handleSubmit(e)}
              >
                <span>Calculate</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default withRouter(Calculator);
