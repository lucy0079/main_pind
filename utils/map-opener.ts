export const openMapTab = (locations: { name: string; lat: number; lng: number }[]) => {
  const encodedLocations = encodeURIComponent(JSON.stringify(locations));
  const mapUrl = new URL(chrome.runtime.getURL("tabs/video-map.html"));
  mapUrl.searchParams.append('locations', encodedLocations);
  
  chrome.runtime.sendMessage({
    type: "OPEN_MAP_TAB",
    url: mapUrl.href
  });
};
