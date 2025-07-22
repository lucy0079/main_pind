import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { openMapTab } from './utils/map-opener'; // 공용 탭 오프너 임포트
import './content.css';

const locationIconUrl = chrome.runtime.getURL('assets/location.png');

const LocationButton: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  const sendYouTubeLink = async () => {
    const url = window.location.href;

    // ✅ 유튜브 정식 도메인에서만 작동
    if (window.location.origin !== "https://www.youtube.com") {
      setMessage("이 확장 기능은 www.youtube.com에서만 사용할 수 있습니다.");
      return;
    }

    if (!url.includes("youtube.com/watch?v=")) {
      setMessage("현재 탭은 YouTube 동영상 페이지가 아닙니다.");
      return;
    }

    setMessage("링크 전송 중...");

    try {
      const backendUrl = "http://192.168.18.124:9000/extract-ylocations/";
      if (!backendUrl) {
        setMessage("백엔드 URL이 설정되지 않았습니다.");
        return;
      }

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ youtube_url: url })
      });

      if (response.ok) {
        const responseData = await response.json();
        setMessage("YouTube 링크가 성공적으로 전송되었습니다!");

        // ✅ 보안: 정확한 origin 지정
        window.postMessage({
          type: "YOUTUBE_LINK_RESPONSE",
          data: responseData
        }, window.origin);

        openMapTab(responseData); // 새 지도 탭 열기
      } else {
        const errorData = await response.json();
        setMessage(`링크 전송 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      setMessage(`링크 전송 중 오류 발생: ${error.message}`);
    }
  };

  return (
    <>
      <button
        className="ytp-button location-finder-button"
        title="영상 속 장소 찾기"
        onClick={sendYouTubeLink}
      >
        <img
          src={locationIconUrl}
          alt="Find location"
          width={24}
          height={24}
          style={{ display: 'block', margin: '0' }}
        />
      </button>
      {message && <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px 10px', borderRadius: '5px', zIndex: 9999 }}>{message}</div>}
    </>
  );
};

const YouTubePlayerIntegration: React.FC = () => {
  const [controlsContainer, setControlsContainer] = useState<Element | null>(null);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          const controls = document.querySelector('.ytp-right-controls');
          const buttonExists = document.querySelector('.location-finder-button');
          if (controls && !buttonExists) {
            setControlsContainer(controls);
            observer.disconnect(); // 버튼을 삽입하면 관찰 중지
            break;
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return controlsContainer ? ReactDOM.createPortal(<LocationButton />, controlsContainer) : null;
};

export default YouTubePlayerIntegration;