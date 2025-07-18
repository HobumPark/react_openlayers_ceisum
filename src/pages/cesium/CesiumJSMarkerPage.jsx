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

      const markerPosition = Cesium.Cartesian3.fromDegrees(127.1026, 37.5126, 0);

    // 마커 추가
    viewer.entities.add({
  name: "롯데월드 타워",
  position: markerPosition,
  billboard: {
    image: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    width: 32,
    height: 32,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  },
  label: {
    text: "롯데월드타워",
    font: "14pt sans-serif",
    verticalOrigin: Cesium.VerticalOrigin.TOP,
    pixelOffset: new Cesium.Cartesian2(0, -40),
  },
  description: `
    <h3>롯데월드타워</h3>
    <p>서울 송파구에 위치한 초고층 빌딩입니다.</p>
  `,
});

// 석촌호수 마커
viewer.entities.add({
  name: "석촌호수",
  position: Cesium.Cartesian3.fromDegrees(127.1038, 37.5108),
  billboard: {
    image: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    width: 28,
    height: 28,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  },
  label: {
    text: "석촌호수",
    font: "13pt sans-serif",
    verticalOrigin: Cesium.VerticalOrigin.TOP,
    pixelOffset: new Cesium.Cartesian2(0, -35),
  },
  description: `
    <h3>석촌호수</h3>
    <p>롯데월드 바로 옆의 산책 명소입니다.</p>
  `,
});

    // 카메라가 마커를 정확히 중심에 보이도록 이동
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(127.1026, 37.5126, 1000), // 마커보다 위쪽 위치
      orientation: {
        heading: Cesium.Math.toRadians(240),
        pitch: Cesium.Math.toRadians(-90), // 정확히 아래를 바라봄
        roll: 0,
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
