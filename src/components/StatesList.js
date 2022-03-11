import React from "react";
import "../statelist.css";
import { Link } from "react-router-dom";

class StatesList extends React.Component {
  state = { US: [] };

  render() {
    return (
      <section id="home-one" className="state-list-wrapper">
        <div className="main-heading">
          <div>
            <h1>Sales tax Calculator</h1>
          </div>
          <div>
            <h2>Select State: </h2>
          </div>
        </div>
        <div className="state-list">
          <ol>
            {this.props.US.map((item) => (
              <li className="state" key={item.name}>
                <Link to={`/sales-tax-calculator/${item.name}`}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }
}

export default StatesList;
