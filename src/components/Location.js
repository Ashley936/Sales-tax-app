import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import React from "react";
function ChangeMapView({ coords, zoom }) {
  const map = useMap();
  map.setView(coords, zoom);

  return null;
}

class Location extends React.Component {
  render() {
    const position = [this.props.lat, this.props.long];
    return (
      <MapContainer
        center={position}
        zoom={this.props.placeType === "city" ? 10 : 5}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeMapView
          coords={position}
          zoom={this.props.placeType === "city" ? 10 : 5}
        />
        <Marker position={position}>
          <Popup>{this.props.city}</Popup>
        </Marker>
      </MapContainer>
    );
  }
}

export default Location;
