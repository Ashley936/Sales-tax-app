import React from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Calculator from "./Calculator";
import StatesList from "./StatesList";
import NavBar from "./NavBar";

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
      .then((res) => this.setState({ allData: res.data }));
    console.log("mount");
  }
  render() {
    return (
      <>
        <BrowserRouter>
          <NavBar allData={this.state.allData} />
          <Routes>
            <Route exact path="/" element={<StatesList US={this.state.US} />} />
            <Route
              exact
              path="/sales-tax-calculator/:state"
              element={
                this.state.allData.length > 0 ? (
                  <Calculator cities={this.state.allData} />
                ) : (
                  ""
                )
              }
            />
            <Route
              exact
              path="/sales-tax-calculator/:state/:city/:zip_code"
              element={
                this.state.allData.length > 0 ? (
                  <Calculator cities={this.state.allData} />
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
