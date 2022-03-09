import React from "react";
import "../statelist.css";
import { Link } from "react-router-dom";

class StatesList extends React.Component {
  state = { US: [] };

  render() {
    return (
      <div className="state-list-wrapper">
        <div className="main-heading">
          <div>Sales tax Calculator </div>
          <div>Select State: </div>
        </div>
        <div className="state-list">
          <ol>
            {this.props.US.map((item) => (
              <li className="state" key={item.name}>
                <Link to={`/sales-tax-calculator/${item["alpha-2"]}`}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default StatesList;
