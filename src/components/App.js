import React from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Calculator from "./Calculator";
import StatesList from "./StatesList";
import NavBar from "./NavBar";
import states from "../api/states";

class App extends React.Component {
  state = { US: [], allData: [] };
  componentDidMount() {
    states
      .get(
        "/Usabystate_States?order=ACL&keys=ACL,name,objectId,postalAbreviation"
      )
      .then((res) => this.setState({ US: res.data.results }));
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
