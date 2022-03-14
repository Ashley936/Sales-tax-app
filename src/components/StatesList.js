import React from "react";
import "../statelist.css";
import { Link, Navigate } from "react-router-dom";

class StatesList extends React.Component {
  state = { US: [], selectedState: "", submit: false };

  render() {
    return (
      <section id="home-one" className="state-list-wrapper">
        {this.state.submit ? (
          <Navigate
            to={`/sales-tax-calculator/${this.state.selectedState}`}
            replace={true}
          />
        ) : (
          ""
        )}
        <div className="main-heading">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>/</li>
            <li>
              <a href="/">Sales Tax Calculator</a>
            </li>
          </ul>

          <div>
            <h1>Sales tax Calculator</h1>
          </div>
          <div>
            <h2>
              Checkout the Latest Sales tax calculator of 2022 with Updated
              Sales Tax rates.{" "}
            </h2>
          </div>
          <form className="states-list">
            <select
              name="states"
              id="states"
              onChange={(e) => {
                let target = e.target;
                let value = target.options[target.selectedIndex].value;
                if (value) {
                  this.setState({ selectedState: value });
                }
              }}
            >
              <option value="">Select State</option>
              {this.props.US.map((item) => (
                <option value={item.name} className="state" key={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (this.state.selectedState) this.setState({ submit: true });
              }}
            >
              <span>Search </span>
              <svg
                width="30"
                height="16"
                viewBox="0 0 30 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M29.7071 8.70711C30.0976 8.31658 30.0976 7.68342 29.7071 7.29289L23.3431 0.928932C22.9526 0.538408 22.3195 0.538408 21.9289 0.928932C21.5384 1.31946 21.5384 1.95262 21.9289 2.34315L27.5858 8L21.9289 13.6569C21.5384 14.0474 21.5384 14.6805 21.9289 15.0711C22.3195 15.4616 22.9526 15.4616 23.3431 15.0711L29.7071 8.70711ZM0 9L29 9V7L0 7L0 9Z"
                  fill="black"
                />
              </svg>
            </button>
          </form>
        </div>
        <section className="section-two">
          <div className="main-heading white">
            <div>
              <h1>Lorem Ipsum</h1>
            </div>
          </div>
        </section>
      </section>
    );
  }
}

export default StatesList;
