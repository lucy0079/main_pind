import React, { useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent'; // 새로운 Map 컴포넌트 임포트

const VideoMapTab: React.FC = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = () => {
      try {
        // URL 파라미터에서 위치 데이터 파싱
        const urlParams = new URLSearchParams(window.location.search);
        const locationsParam = urlParams.get('locations');
        if (locationsParam) {
          const decodedLocations = JSON.parse(decodeURIComponent(locationsParam));
          setLocations(decodedLocations);
        } else {
          // 위치 데이터가 없으면 빈 배열로 설정
          setLocations([]);
        }
      } catch (e) {
        console.error("Initialization failed:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MapComponent locations={locations} />
    </div>
  );
};

export default VideoMapTab;
