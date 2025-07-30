import React, { useState } from "react";
import {
  Map,
  MapMarker,
  MapTypeControl,
  ZoomControl
} from "react-kakao-maps-sdk";
import './KakaoMapPage.css';
import woljeong from '../../assets/map/woljeong.jpg';

const KakaoMapPage = () => {
  const [level, setLevel] = useState(3);
  const [map, setMap] = useState(null); // 지도 객체 저장
  const [roadViewVisible, setRoadViewVisible] = useState(false);
  const [trafficViewVisible, setTrafficViewVisible] = useState(false);
  const [showInfo, setShowInfo] = useState(false); // 마커 클릭 토글용

  const handleMarkerClick = () => {
    setShowInfo((prev) => !prev);
  };

  const increaseZoom = () => {
    if (level < 14) setLevel((prev) => prev + 1);
  };

  const decreaseZoom = () => {
    if (level > 1) setLevel((prev) => prev - 1);
  };

  const toggleRoadView = () => {
    if (!map) return;

    if (roadViewVisible) {
      map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
    } else {
      map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
    }

    setRoadViewVisible(!roadViewVisible);
  };

  const toggleTrafficView = () => {
    if (!map) return;

    if (trafficViewVisible) {
      map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC);
    } else {
      map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC);
    }

    setTrafficViewVisible(!trafficViewVisible);
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={decreaseZoom}>+</button>
        <button onClick={increaseZoom}>-</button>
        <button onClick={toggleRoadView}>
          {roadViewVisible ? "로드뷰 끄기" : "로드뷰 보기"}
        </button>
        <button onClick={toggleTrafficView}>
          {trafficViewVisible ? "교통정보 끄기" : "교통정보 보기"}
        </button>
      </div>

      <Map
        center={{ lat: 33.5563, lng: 126.79581 }}
        style={{ width: "100%", height: "500px" }}
        level={level}
        id="dark-map"
        mapTypeId={window.kakao.maps.MapTypeId.ROADMAP}
        onCreate={setMap} // 지도 객체를 저장
      >
        <MapMarker
          position={{ lat: 33.55635, lng: 126.795841 }}
          onClick={handleMarkerClick}
        >
          {showInfo && (
            <div className="marker-info-box">
              <img src={woljeong} alt="월정리" />
              <span>
                <a href="https://namu.wiki/w/%EC%9B%94%EC%A0%95%EB%A6%AC%ED%95%B4%EC%88%98%EC%9A%95%EC%9E%A5">
                  월정리 해수욕장
                </a>
                월정리 해수욕장</span>
            </div>
          )}
        </MapMarker>

        <MapTypeControl position={window.kakao.maps.ControlPosition.TOPRIGHT} />
        <ZoomControl position={window.kakao.maps.ControlPosition.RIGHT} />
      </Map>
    </div>
  );
};

export default KakaoMapPage;
