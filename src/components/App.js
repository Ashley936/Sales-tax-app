import React from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Calculator from "./Calculator";
import StatesList from "./StatesList";
import NavBar from "./NavBar";
import ScrollToTop from "./ScrollToTop";

class App extends React.Component {
  state = { US: [], allData: [] };
  componentDidMount() {
    axios
      .get(
        "https://gist.githubusercontent.com/tvpmb/4734703/raw/b54d03154c339ed3047c66fefcece4727dfc931a/US%2520State%2520List"
      )
      .then((res) => this.setState({ US: res.data }));
    axios
      .get(
        "https://raw.githubusercontent.com/millbj92/US-Zip-Codes-JSON/master/USCities.json"
      )
      .then((res) => {
        let allData = res.data.sort(function (a, b) {
          return a.city.localeCompare(b.city);
        });
        this.setState({ allData });
      });
    console.log("mount");
  }
  render() {
    return (
      <>
        <BrowserRouter>
          <ScrollToTop />
          <NavBar allData={this.state.allData} />
          <Routes>
            <Route exact path="/" element={<StatesList US={this.state.US} />} />
            <Route
              exact
              path="/sales-tax-calculator/:state"
              element={
                this.state.allData.length > 0 && this.state.US.length > 0 ? (
                  <Calculator
                    cities={this.state.allData}
                    stateNames={this.state.US}
                  />
                ) : (
                  ""
                )
              }
            />
            <Route
              exact
              path="/sales-tax-calculator/:state/:city/:zip_code"
              element={
                this.state.allData.length > 0 && this.state.US.length > 0 ? (
                  <Calculator
                    cities={this.state.allData}
                    stateNames={this.state.US}
                  />
                ) : (
                  ""
                )
              }
            />
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
