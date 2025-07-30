import React, { useState } from "react";
import {
  Map,
  MapMarker,
  MapTypeControl,
  ZoomControl
} from "react-kakao-maps-sdk";
import './KakaoMapPage2.css';
import woljeong from '../../assets/map/woljeong.jpg';
import baseball from '../../assets/map/baseball.png';
import lionsPark from '../../assets/map/lions-park.png';
import movie from '../../assets/map/movie.png';
import cgv from '../../assets/map/cgv.png';

const KakaoMapPage2 = () => {
  const [level, setLevel] = useState(5);
  const [map, setMap] = useState(null); // 지도 객체 저장
  const [roadViewVisible, setRoadViewVisible] = useState(false);
  const [trafficViewVisible, setTrafficViewVisible] = useState(false);
  const [showInfo1, setShowInfo1] = useState(false); // 마커 클릭 토글용
  const [showInfo2, setShowInfo2] = useState(false); // 마커 클릭 토글용

  const handleMarkerClick1 = () => {
    setShowInfo1((prev) => !prev);
  };
  const handleMarkerClick2 = () => {
    setShowInfo2((prev) => !prev);
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
        center={{ lat: 35.83668, lng: 128.68742 }}
        style={{ width: "100%", height: "500px" }}
        level={level}
        id="dark-map"
        mapTypeId={window.kakao.maps.MapTypeId.ROADMAP}
        onCreate={setMap} // 지도 객체를 저장
      >
        <MapMarker
          position={{ lat: 35.84111, lng: 128.68169 }}
          onClick={handleMarkerClick1}
          image={{
            src: baseball, // 커스텀 마커 이미지 경로 (import 한 이미지 변수도 가능)
            size: {
              width: 54,
              height: 59
            },
            options: {
              offset: {
                x: 27,
                y: 72
              }
            }
          }}
        >
          {showInfo1 && (
            <div className="marker">
              <span>삼성 라이온즈 파크</span>
              <span>
                <img src={lionsPark} alt="" />
                <a href="https://namu.wiki/w/%EB%8C%80%EA%B5%AC%20%EC%82%BC%EC%84%B1%20%EB%9D%BC%EC%9D%B4%EC%98%A8%EC%A6%88%20%ED%8C%8C%ED%81%AC">링크</a>
              </span>
            </div>
          )}
        </MapMarker>

        <MapMarker
          position={{ lat: 35.83149, lng: 128.68727 }}
          onClick={handleMarkerClick2}
          image={{
            src: movie, // 커스텀 마커 이미지 경로 (import 한 이미지 변수도 가능)
            size: {
              width: 54,
              height: 59
            },
            options: {
              offset: {
                x: 27,
                y: 72
              }
            }
          }}
        >
          {showInfo2 && (
            <div className="marker">
              <span>CGV</span>
              <span>
                <img src={cgv} alt="" />
                <a href="https://namu.wiki/w/CGV%20%EB%8C%80%EA%B5%AC%EC%8A%A4%ED%83%80%EB%94%94%EC%9B%80">링크</a>
              </span>
            </div>
          )}
        </MapMarker>

        <MapTypeControl position={window.kakao.maps.ControlPosition.TOPRIGHT} />
        <ZoomControl position={window.kakao.maps.ControlPosition.RIGHT} />
      </Map>
    </div>
  );
};

export default KakaoMapPage2;
