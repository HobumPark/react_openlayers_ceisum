import React, { useEffect, useRef } from "react";
// CesiumJS 전체 모듈을 불러옴
import * as Cesium from "cesium/Cesium.js";
// Cesium 위젯 관련 기본 CSS 불러오기
import "cesium/Widgets/widgets.css";

// Cesium 정적 리소스 경로 설정 (위젯 이미지 등)
window.CESIUM_BASE_URL = "/cesium";

// ✅ Ion Access Token 설정 (Cesium Ion 서비스 사용을 위한 인증 키)
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNTBkMmVlOS0zNjhlLTRjNDAtOTQ1ZC0zZmRiN2E4Njc1NjAiLCJpZCI6MzIyMjkzLCJpYXQiOjE3NTI4MDc5MTJ9.LA_gnWHZT7la_IyF-jImYgspmAmlmUo9HXejM2P7R5E";

const CesiumJSFullPage = () => {
  // DOM에 연결될 viewer container 참조 생성
  const viewerRef = useRef(null);

  useEffect(() => {
    let viewer; // Cesium.Viewer 인스턴스를 저장할 변수

    // Cesium Viewer 초기화 함수 (비동기)
    const initViewer = async () => {
      // 전 세계 지형 데이터 로딩 (해발고도 등 표현 가능)
      const terrain = await Cesium.createWorldTerrainAsync();

      // Cesium Viewer 생성
      viewer = new Cesium.Viewer(viewerRef.current, {
        terrainProvider: terrain, // 지형 데이터 주입
        // imageryProvider 생략 시 기본 Bing Maps imagery 사용됨
        // baseLayerPicker: true 가 기본값이므로 UI 포함됨
      });

      // 태양 조명 효과 끄기 (그림자 등 제거)
      viewer.scene.globe.enableLighting = false;

      // 카메라 초기 위치 설정 (경북 포항 근처 좌표)
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(128.62681, 35.86697, 15000), // 위도, 경도, 높이
        orientation: {
          heading: Cesium.Math.toRadians(0), // 북쪽을 바라봄
          pitch: Cesium.Math.toRadians(-45), // 지면을 45도 아래로 바라봄
          roll: 0, // 회전 없음
        },
      });

      // 이미지 레이어 추가 시 콘솔 로그 출력 (디버깅용)
      viewer.scene.imageryLayers.layerAdded.addEventListener(() => {
        console.log("Imagery Layer 로딩됨");
      });

      // terrainProvider 정보 출력 (디버깅용)
      console.log("🌍 TerrainProvider: ", viewer.terrainProvider);
    };

    // Viewer 초기화 호출
    initViewer();

    // 언마운트 시 viewer 메모리 해제 (필수)
    return () => {
      if (viewer) viewer.destroy();
    };
  }, []); // 의존성 배열 비워두면 컴포넌트 최초 마운트 시 1회 실행

  // 지도가 렌더링될 DOM 요소
  return <div ref={viewerRef} style={{ width: "100%", height: "90vh" }} />;
};

export default CesiumJSFullPage;
