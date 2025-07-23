import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import './css/MapBoxPage.css';

// 본인 Mapbox 토큰으로 변경하세요
mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

const MapBoxPage = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // 이미 생성된 경우 방지

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11", // 스타일 종류 다양
      center: [127.024612, 37.532600], // 서울 좌표 (경도, 위도)
      zoom: 12,
    });

    // 컨트롤 추가 (줌 버튼 등)
    map.current.addControl(new mapboxgl.NavigationControl());

    // 컴포넌트 언마운트시 맵 정리
    return () => map.current.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "500px" }}
    />
  );
};

export default MapBoxPage;
