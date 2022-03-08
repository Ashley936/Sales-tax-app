import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import React from "react";
const mapStyles = {
  width: "100%",
  height: "80%",
};
class Location extends React.Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={8}
        style={mapStyles}
        initialCenter={{ lat: 47.444, lng: -122.176 }}
      >
        <Marker position={{ lat: this.props.lat, lng: this.props.long }} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBmLiUR80JI0_mgIUoih-pNquudZZDrIQM",
})(Location);
