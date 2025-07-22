import React, { useState, useEffect } from 'react';
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

interface Location {
  name: string;
  lat: number;
  lng: number;
}

const VideoMapReact: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const locationsParam = params.get('locations');
    if (locationsParam) {
      try {
        const parsedLocations: Location[] = JSON.parse(decodeURIComponent(locationsParam));
        setLocations(parsedLocations);
      } catch (e) {
        console.error("Error parsing locations from URL:", e);
      }
    }

    // Listen for messages from content.tsx
    const handleWindowMessage = (event) => {
      console.log("video_map_react: Received window message:", event); // 추가
      if (event.data.type === "YOUTUBE_LINK_RESPONSE" && event.data.data) {
        console.log("video_map_react: Processing YOUTUBE_LINK_RESPONSE. Data:", event.data.data); // 추가
        setLocations(event.data.data);
      }
    };

    // Listen for messages from popup.tsx (keep this as is)
    const handleChromeMessage = (message, sender, sendResponse) => {
      console.log("video_map_react: Received chrome message:", message); // 추가
      if (message.type === "YOUTUBE_LINK_RESPONSE" && message.data) {
        console.log("video_map_react: Processing YOUTUBE_LINK_RESPONSE from chrome. Data:", message.data); // 추가
        setLocations(message.data);
        sendResponse({ status: "success" });
      }
    };
    chrome.runtime.onMessage.addListener(handleChromeMessage);

    // Listen for messages from content.tsx
    window.addEventListener('message', handleWindowMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleChromeMessage);
      window.removeEventListener('message', handleWindowMessage);
    };
  }, []); // End of useEffect for listeners

  const defaultCenter = locations.length > 0 ?
    { lat: locations[0].lat, lng: locations[0].lng } :
    { lat: 37.5665, lng: 126.9780 }; // 기본값: 서울 시청

  useEffect(() => {
    console.log("video_map_react: Current locations state (after update):", locations); // 유지
    console.log("video_map_react: Default map center (after update):", defaultCenter); // 유지
    if (locations.length > 0) {
      locations.forEach((loc, index) => {
        console.log(`video_map_react: Location ${index}: name=${loc.name}, lat=${loc.lat}, lng=${loc.lng}`); // 추가
        if (typeof loc.lat !== 'number' || typeof loc.lng !== 'number' || isNaN(loc.lat) || isNaN(loc.lng)) {
          console.error(`video_map_react: Invalid lat/lng for location ${loc.name}:`, loc); // 추가
        }
      });
    } else {
      console.log("video_map_react: Locations array is empty."); // 추가
    }
  }, [locations, defaultCenter]); // End of useEffect for logging locations and center

  console.log("video_map_react: MapContainer rendering with center:", defaultCenter); // 추가
  console.log("video_map_react: MapContainer rendering with locations count:", locations.length); // 추가

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc, index) => {
          console.log(`video_map_react: Rendering Marker for ${loc.name} at [${loc.lat}, ${loc.lng}]`); // 추가
          return (
            <Marker key={index} position={[loc.lat, loc.lng]}>
              <Popup>{loc.name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default VideoMapReact;
