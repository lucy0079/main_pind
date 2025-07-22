// 이 함수는 Google Maps API가 로드된 후 호출됩니다.
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.5665, lng: 126.9780 }, // 서울 시청
        zoom: 12,
        gestureHandling: 'greedy',
        disableDefaultUI: true
    });

    // 예시 마커 추가 (popup.tsx의 예시 위치와 동일하게)
    const exampleLocations = [
        { name: "Gold Pâtisserie", lat: 37.5665, lng: 126.9780 },
        { name: "Daehan Gukbap", lat: 37.5700, lng: 126.9800 }
    ];

    exampleLocations.forEach(loc => {
        new google.maps.Marker({n            position: { lat: loc.lat, lng: loc.lng },
            map: map,
            title: loc.name
        });
    });
}