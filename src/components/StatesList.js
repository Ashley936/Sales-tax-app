import React from "react";
import "../statelist.css";
import { Link } from "react-router-dom";

class StatesList extends React.Component {
  state = { US: [] };

  render() {
    return (
      <div className="state-list-wrapper">
        <div className="main-heading">Select State : </div>
        <ol className="state-list">
          {this.props.US.map((item) => (
            <li className="state" key={item.objectId}>
              <Link to={`/sales-tax-calculator/${item.postalAbreviation}`}>
                {item.name}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    );
  }
}

export default StatesList;
