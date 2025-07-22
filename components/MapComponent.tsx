import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Leaflet CSS 임포트
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Leaflet 기본 아이콘 설정
L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

interface MapComponentProps {
  locations: { name: string; lat: number; lng: number }[];
}

const MapComponent: React.FC<MapComponentProps> = ({ locations }) => {
  // 지도의 기본 중심 위치 설정 (locations가 비어있을 경우)
  const defaultCenter = { lat: 37.5665, lng: 126.9780 }; // 서울 시청

  // locations 배열이 비어있지 않다면 첫 번째 위치를 중심으로, 그렇지 않으면 기본값을 사용
  const mapCenter = locations.length > 0 ? { lat: locations[0].lat, lng: locations[0].lng } : defaultCenter;

  return (
    <MapContainer
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location, index) => (
        <Marker key={index} position={[location.lat, location.lng]}>
          <Popup>{location.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
