import React from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import Calculator from "./Calculator";
import StatesList from "./StatesList";
import NavBar from "./NavBar";
import states from "../api/states";

class App extends React.Component {
  state = { US: [] };
  componentDidMount() {
    states
      .get(
        "/Usabystate_States?order=ACL&keys=ACL,name,objectId,postalAbreviation"
      )
      .then((res) => this.setState({ US: res.data.results }));
    console.log("mount");
  }
  render() {
    console.log(this.state);
    return (
      <>
        <NavBar />
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<StatesList US={this.state.US} />} />
            <Route
              exact
              path="/sales-tax-calculator"
              element={<Calculator cities={this.state.cities} />}
            />
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
