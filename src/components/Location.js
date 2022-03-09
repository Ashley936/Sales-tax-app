import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import React from "react";
function ChangeMapView({ coords }) {
  const map = useMap();
  map.setView(coords, map.getZoom());

  return null;
}

class Location extends React.Component {
  render() {
    const position = [this.props.lat, this.props.long];
    return (
      <MapContainer
        style={{ width: "100%", height: "80vh" }}
        center={position}
        zoom={8}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeMapView coords={position} />
        <Marker position={position}>
          <Popup>
            {this.props.city}({this.props.zip_code})
          </Popup>
        </Marker>
      </MapContainer>
    );
  }
}

export default Location;
