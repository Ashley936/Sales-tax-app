import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import taxRate from "../api/taxRate";
import "../calculator.css";
import Location from "./Location";

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
    rates: [],
    principal: "",
    finalAmount: "",
    n: 0,
    expand: {},
    showList: true,
  };
  updateDetails = () => {
    let stateCode = this.props.match.params.state;
    let selectedCity = this.props.match.params.city;
    let cityCode = this.props.match.params.zip_code;
    let cities = this.props.cities.filter((item) => item.state === stateCode);
    if (!selectedCity || !cityCode) {
      selectedCity = cities[0];
    } else {
      selectedCity = this.props.cities.filter(
        (item) =>
          item.city === selectedCity && item.zip_code === parseInt(cityCode)
      )[0];
    }

    this.getTaxRate(selectedCity.zip_code);
    return { cities, selectedCity };
  };
  componentDidMount() {
    let { cities, selectedCity } = this.updateDetails();
    this.setState({ cities, selectedCity });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.zip_code !== this.props.match.params.zip_code) {
      let { cities, selectedCity } = this.updateDetails();
      this.setState({
        selectedCity,
        cities,
      });
    }
  }

  getTaxRate = (code) => {
    code = code.toString();
    while (code.length !== 5) {
      code = "0" + code;
    }
    taxRate.get(`/bypostalcode?country=USA&postalCode=${code}`).then((res) => {
      console.log(res.data);
      this.setState({ rate: res.data.totalRate, rates: res.data.rates });
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
  setInnerHtml = (codes, cityInfo) => {
    return (
      <ul className="sub-list">
        {codes.map((item) => (
          <li key={item}>
            <Link
              to={`/sales-tax-calculator/${cityInfo.state}/${cityInfo.city}/${item}`}
            >
              {item}
            </Link>
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
  renderTaxRateInfo = (taxes) => {
    if (taxes.length === 1) {
      return `Here all the tax i.e. ${taxes[0].rate}is due to the ${taxes[0].type} tax.`;
    } else {
      return `The total tax here can be divided into ${taxes.length} parts.
      ${taxes.map(
        (taxInfo) => ` ${taxInfo.type} tax: ${taxInfo.rate}% ${" "}`
      )}`;
    }
  };
  render() {
    return (
      <div className="ultimate-wrapper">
        <div className="side-page-container">
          <div
            className="open-list hide"
            onClick={() => {
              let action = !this.state.showList;
              this.setState({ showList: action });
            }}
          >
            {this.state.showList ? "SHOW" : "HIDE"} CITIES
          </div>
          <div
            className={`city-list ${this.state.showList ? "show-list" : ""}`}
          >
            <ol>
              {this.unique(this.state.cities, "city")
                .slice(this.state.n, this.state.n + 10)
                .map((item) => (
                  <li className="main-list-item" key={item.city}>
                    <div className="list-item-name">
                      <Link
                        to={`/sales-tax-calculator/${item.state}/${item.city}/${item.zip_code}`}
                      >
                        {item.city}
                      </Link>

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
            <div className="pagination-controls">
              {" "}
              <span
                className="controls"
                onClick={() =>
                  this.state.n > 0
                    ? this.setState({ n: this.state.n - 10 })
                    : ""
                }
              >
                -
              </span>
              <span>List More </span>
              <span
                className="controls"
                onClick={() =>
                  this.state.n + 10 <
                  this.unique(this.state.cities, "city").length
                    ? this.setState({ n: this.state.n + 10 })
                    : ""
                }
              >
                +
              </span>
            </div>
          </div>
          <div className="sales-tax-form-container">
            <h1>
              Sales Tax for <span>{this.state.selectedCity.city}:</span>
            </h1>
            <div className="location-content">
              <p>
                Below you can find the general sales tax calculator for{" "}
                {this.state.selectedCity.city} city for the year 2021. This is a
                custom and easy to use <Link to="/">sales tax calculator</Link>.
              </p>
            </div>
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
            <div className="calculator-info">
              <div className="sub-heading">
                How to use the Sales Tax Calculator ?
              </div>
              <div className="sub-context">
                <ol>
                  <li key="1">
                    {" "}
                    Enter your principal <b>"Amount"</b> in the first input box.
                  </li>
                  <li key="2">
                    {" "}
                    Total tax rate for your chosen location is already filled in
                    the <b>"tax rate"</b> but you can change it to any rate
                    desired.
                  </li>
                  <li key="3">
                    That's it. Now click on calculate to get the final amount
                    (including the tax).
                  </li>
                </ol>
              </div>
            </div>
            <div className="calculation-method">
              <div className="sub-heading">
                Method to calculate {this.state.selectedCity.city} sales tax in
                2022
              </div>
              <div className="sub-context">
                As we all know, there are different sales tax rates from state
                to city to your area, and everything combined is the required
                tax rate. In {this.state.selectedCity.city}, the total sales tax
                rate is {this.state.rate}. <br />
                {this.state.rates.length > 0
                  ? this.renderTaxRateInfo(this.state.rates)
                  : ""}
                <br />
                The Sales tax rates may differ depending on the type of
                purchase. Usually it includes rentals, lodging, consumer
                purchases, sales, etc.
              </div>
            </div>
            <div className="city-info">
              <div className="sub-heading">
                More About {this.state.selectedCity.city}
              </div>
              <div className="sub-context">
                {this.state.selectedCity.city} city is located in{" "}
                {this.state.selectedCity.county} county in state{" "}
                {this.state.selectedCity.state} with zip-code :-{" "}
                {this.state.selectedCity.zip_code}.<br />
                {this.getPincodes(this.state.selectedCity.city).length > 1
                  ? `Some cities have multiple zip-codes to distinguish between different areas. ${
                      this.state.selectedCity.city
                    } have the following zip-codes : ${this.getPincodes(
                      this.state.selectedCity.city
                    ).map((code) => `${" "}${code}`)} `
                  : ""}
              </div>
            </div>
          </div>
        </div>
        {this.state.selectedCity.city ? (
          <Location
            lat={this.state.selectedCity.latitude}
            long={this.state.selectedCity.longitude}
            zip_code={this.state.selectedCity.zip_code}
            city={this.state.selectedCity.city}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
export default withRouter(Calculator);
