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
  _isMounted = false;
  state = {
    cities: [],
    selectedCity: {},
    stateName: "",
    rate: "",
    rates: [],
    principal: "",
    finalAmount: "",
    expand: {},
    showList: true,
  };

  updateDetails = () => {
    let state = this.props.match.params.state;
    let stateInfo = this.props.stateNames.find(
      (item) => item.name === state || item["alpha-2"] === state
    );
    let selectedCity = this.props.match.params.city;
    let cityCode = this.props.match.params.zip_code;
    let cities = this.props.cities.filter(
      (item) => item.state === stateInfo["alpha-2"]
    );
    if (!selectedCity || !cityCode) {
      selectedCity = cities[0];
    } else {
      selectedCity = this.props.cities.filter(
        (item) =>
          item.city === selectedCity && item.zip_code === parseInt(cityCode)
      )[0];
    }

    this.getTaxRate(selectedCity.zip_code);
    return { cities, selectedCity, stateName: stateInfo.name };
  };
  componentDidMount() {
    this._isMounted = true;
    let { cities, selectedCity, stateName } = this.updateDetails();
    if (this._isMounted) this.setState({ cities, selectedCity, stateName });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.zip_code !== this.props.match.params.zip_code) {
      let { cities, selectedCity, stateName } = this.updateDetails();
      this.setState({
        selectedCity,
        cities,
        stateName,
      });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  getTaxRate = (code) => {
    code = code.toString();
    while (code.length !== 5) {
      code = "0" + code;
    }
    taxRate.get(`/bypostalcode?country=USA&postalCode=${code}`).then((res) => {
      let rate = this.props.match.params.zip_code
        ? res.data.totalRate
        : res.data.rates.find((item) => item.type === "State").rate;
      this.setState({ rate: rate * 100, rates: res.data.rates });
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
              <div>{item}</div>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let finalAmount =
      parseFloat(this.state.principal) +
      (this.state.principal * this.state.rate) / 100;
    this.setState({ finalAmount });
  };
  renderTaxRateInfo = (taxes) => {
    if (taxes.length === 1) {
      return `Here all the tax i.e. ${taxes[0].rate * 100}% is due to the ${
        taxes[0].type
      } tax.`;
    } else {
      return `The total tax here can be divided into ${taxes.length} parts.
      ${taxes.map(
        (taxInfo) => ` ${taxInfo.type} tax: ${taxInfo.rate * 100}% ${" "}`
      )}`;
    }
  };
  render() {
    return (
      <>
        <section className="side-page-container">
          <section className="sales-tax-form-container">
            <h1>
              {this.props.match.params.zip_code
                ? this.state.selectedCity.city
                : this.state.stateName}{" "}
              Sales Tax Calculator in 2022{" "}
            </h1>
            <section className="location-content">
              <p>
                Below you can find the general sales tax calculator for{" "}
                {this.props.match.params.zip_code
                  ? this.state.selectedCity.city
                  : this.state.stateName}{" "}
                {this.props.match.params.zip_code ? "city" : "state"} for the
                year 2021. This is a custom and easy to use{" "}
                <Link to="/">sales tax calculator</Link>.
              </p>
            </section>
            <form action="" className="sales-tax-form">
              <div className="form-heading">Calculate</div>
              <div>
                <input
                  name="principal"
                  placeholder="amount before tax"
                  type="number"
                  value={this.state.principal}
                  onChange={(e) => this.setState({ principal: e.target.value })}
                  className="principal"
                  required
                />
              </div>
              <div>
                <input
                  name="tax-rate"
                  placeholder="tax rate"
                  type="number"
                  value={this.state.rate}
                  onChange={(e) => this.setState({ rate: e.target.value })}
                  className="rate"
                  required
                />
              </div>
              <div>
                <input
                  name="final-amount"
                  placeholder="amount after tax"
                  value={this.state.finalAmount}
                  className="final-amount"
                  readOnly
                />
              </div>
              <div>
                <input
                  name="tax-amount"
                  placeholder="tax amount"
                  value={
                    this.state.finalAmount
                      ? this.state.finalAmount - this.state.principal
                      : ""
                  }
                  className="tax-amount"
                  readOnly
                />
              </div>

              <button
                className="calculate-btn"
                onClick={(e) => this.handleSubmit(e)}
              >
                <span>Calculate</span>
              </button>
            </form>
          </section>
          <section className="city-list show-list">
            <ol>
              <li id="list-heading">More cities from {this.state.stateName}</li>
              {this.unique(this.state.cities, "city").map((item) => (
                <li className="main-list-item" key={item.city}>
                  <div
                    className="list-item-name"
                    onClick={(e) => {
                      var obj = { ...this.state.expand };

                      this.state.expand[item.city]
                        ? (obj[item.city] = false)
                        : (obj[item.city] = true);
                      this.setState({ expand: obj });
                    }}
                  >
                    {item.city}

                    <div className="min-max-icon">
                      {this.state.expand[item.city] ? (
                        <span>&laquo;</span>
                      ) : (
                        <span>&raquo; </span>
                      )}
                    </div>
                  </div>

                  {this.state.expand[item.city]
                    ? this.setInnerHtml(this.getPincodes(item.city), item)
                    : ""}
                </li>
              ))}
            </ol>
          </section>
        </section>
        <section className="sales-tax-form-info">
          <section className="calculator-info">
            <div className="sub-heading">
              <h2>How to use the Sales Tax Calculator ?</h2>
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
          </section>
          <section className="calculation-method">
            <div className="sub-heading">
              <h2>
                Method to calculate{" "}
                {this.props.match.params.zip_code
                  ? this.state.selectedCity.city
                  : this.state.stateName}{" "}
                sales tax in 2022
              </h2>
            </div>
            <div className="sub-context">
              <p>
                As we all know, there are different sales tax rates from state
                to city to your area, and everything combined is the required
                tax rate. In{" "}
                {this.props.match.params.zip_code
                  ? this.state.selectedCity.city
                  : this.state.stateName}
                , the total sales tax rate is {this.state.rate}% .{" "}
              </p>
              <p>
                {this.state.rates.length > 0 && this.props.match.params.zip_code
                  ? this.renderTaxRateInfo(this.state.rates)
                  : ""}
                <br />
                The Sales tax rates may differ depending on the type of
                purchase. Usually it includes rentals, lodging, consumer
                purchases, sales, etc.
              </p>
            </div>
          </section>
          <section className="city-info">
            <div className="sub-heading">
              <h2>
                More About{" "}
                <a
                  href={`https://en.wikipedia.org/wiki/${
                    this.props.match.params.zip_code
                      ? `${this.state.selectedCity.city},_${this.state.stateName}`
                      : this.state.stateName
                  }`}
                >
                  {this.props.match.params.zip_code
                    ? this.state.selectedCity.city
                    : this.state.stateName}
                </a>
              </h2>
            </div>
            <div className="sub-context">
              {this.props.match.params.zip_code
                ? `${this.state.selectedCity.city} city is located in
                ${this.state.selectedCity.county} county in state
                ${this.state.stateName} with zip-code :-
                ${this.state.selectedCity.zip_code}.

                ${
                  this.getPincodes(this.state.selectedCity.city).length > 1
                    ? `Some cities have multiple zip-codes to distinguish between different areas. ${
                        this.state.selectedCity.city
                      } have the following zip-codes : ${this.getPincodes(
                        this.state.selectedCity.city
                      ).map((code) => `${" "}${code}`)}`
                    : ""
                }`
                : (() => (
                    <div>
                      To get more information about {this.state.stateName},{" "}
                      <a
                        href={`https://www.${this.state.stateName.replace(
                          /\s+/g,
                          ""
                        )}.gov/`}
                      >
                        click here
                      </a>
                      <p>
                        Checkout Official state taxes from{" "}
                        <a href="https://www.salestaxinstitute.com/resources/rates">
                          here.
                        </a>
                      </p>
                    </div>
                  ))()}
            </div>
          </section>
        </section>
        <section className="location">
          <h1>Location </h1>
          {this.state.selectedCity.city ? (
            <Location
              lat={
                this.props.match.params.zip_code
                  ? this.state.selectedCity.latitude
                  : this.state.selectedCity.latitude + 0.01
              }
              long={
                this.props.match.params.zip_code
                  ? this.state.selectedCity.longitude
                  : this.state.selectedCity.longitude + 0.01
              }
              city={
                this.props.match.params.zip_code
                  ? this.state.selectedCity.city
                  : this.state.stateName
              }
              placeType={this.props.match.params.zip_code ? "city" : "state"}
            />
          ) : (
            ""
          )}
        </section>
      </>
    );
  }
}
export default withRouter(Calculator);
