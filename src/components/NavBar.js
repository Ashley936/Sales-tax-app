import React from "react";
import { Link } from "react-router-dom";
import "../navbar.css";
class NavBar extends React.Component {
  state = { search: "", results: [] };
  findData = (inputValue) => {
    const newArr = this.props.allData.filter((place) => {
      return (
        place.city.toLowerCase().includes(inputValue) ||
        place.state.toLowerCase().includes(inputValue) ||
        place.county.toLowerCase().includes(inputValue) ||
        place.zip_code.toString().toLowerCase().includes(inputValue)
      );
    });
    return newArr;
  };
  clearSearch = () => {
    if (this.state.results.length > 0) {
      this.setState({ search: "", results: [] });
    }
  };
  componentDidMount() {
    window.addEventListener("click", this.clearSearch);
  }
  componentWillUnmount() {
    window.removeEventListener("click", this.clearSearch);
  }
  render() {
    return (
      <nav>
        <div className="navbar-wrapper">
          <div className="nav-icon">
            <Link to="/">
              <span>L</span>ogo
            </Link>
          </div>
          <div className="nav-list">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/">Sales Tax Calculator</a>
              </li>
            </ul>
          </div>
          <div className="content-wrapper">
            <div className="search-wrapper active">
              <div className="search-input">
                <input
                  value={this.state.search}
                  onChange={(e) => {
                    let results = this.findData(
                      e.target.value.toLowerCase()
                    ).slice(0, 20);
                    if (e.target.value === "") results = [];
                    this.setState({
                      search: e.target.value,
                      results,
                    });
                  }}
                  type="text"
                  placeholder="Search..."
                  id="mysearch"
                />
              </div>

              <div className="search-icon"></div>
            </div>

            <ul className="search-result-list">
              {this.state.results.map((item) => {
                return (
                  <li
                    key={item.zip_code}
                    onClick={(e) => {
                      e.stopPropagation();
                      this.setState({ search: "", results: [] });
                    }}
                  >
                    <Link
                      to={`/sales-tax-calculator/${item.state}/${item.city}/${item.zip_code}`}
                    >
                      <div>
                        <span>
                          {item.city}, {item.county}({item.state})
                        </span>
                        <span>{item.zip_code}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
export default NavBar;
