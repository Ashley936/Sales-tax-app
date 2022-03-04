import React from "react";
import { Link } from "react-router-dom";

class StatesList extends React.Component {
  state = { US: [] };

  render() {
    return (
      <div>
        <ol>
          {this.props.US.map((item) => (
            <li key={item.objectId}>
              <Link
                to={`/sales-tax-calculator?state=${item.postalAbreviation}`}
              >
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
