import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium/Cesium.js";
import "cesium/Widgets/widgets.css";

window.CESIUM_BASE_URL = "/cesium";

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNTBkMmVlOS0zNjhlLTRjNDAtOTQ1ZC0zZmRiN2E4Njc1NjAiLCJpZCI6MzIyMjkzLCJpYXQiOjE3NTI4MDc5MTJ9.LA_gnWHZT7la_IyF-jImYgspmAmlmUo9HXejM2P7R5E";

const CesiumJSRoadPage2 = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
    let viewer;

    const initViewer = async () => {
      const terrain = await Cesium.createWorldTerrainAsync();

      viewer = new Cesium.Viewer(viewerRef.current, {
        terrainProvider: terrain,
      });

      viewer.scene.globe.enableLighting = false;

      // 강변북로 인근 고가도로 표현용 좌표 (서울 한남동 근처 예시)
      // 1층 도로 좌표
      const firstFloorCoords = [
        [126.99332, 37.51924],
        [126.99470, 37.51983],
        [126.99476, 37.51968],
        [126.99345, 37.51915],
      ];

      // 2층 도로 좌표 (고가, 약간 축소 및 높이 10m)
      const secondFloorCoords = [
        [126.99399, 37.51983],
        [126.99416, 37.51987],
        [126.99435, 37.51919],
        [126.99418, 37.51916]
      ];
 
      const firstFloorPositions = firstFloorCoords.map(([lon, lat]) =>
        Cesium.Cartesian3.fromDegrees(lon, lat, 0)
      );

      const secondFloorPositions = secondFloorCoords.map(([lon, lat]) =>
        Cesium.Cartesian3.fromDegrees(lon, lat, 10)
      );

      // 1층 도로 폴리곤
      viewer.entities.add({
        name: "1층 도로",
        polygon: {
          hierarchy: firstFloorPositions,
          material: Cesium.Color.DARKGRAY.withAlpha(0.7),
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          height: 0,
        },
      });

      // 2층 고가도로 폴리곤
      viewer.entities.add({
        name: "2층 고가도로",
        polygon: {
          hierarchy: secondFloorPositions,
          material: Cesium.Color.ORANGE.withAlpha(0.6),
          outline: true,
          outlineColor: Cesium.Color.RED,
          height: 0,
          extrudedHeight: 10,
          closeTop: true,
          closeBottom: true,
        },
      });

      // 강변북로 마커
      viewer.entities.add({
        name: "강변북로",
        position: Cesium.Cartesian3.fromDegrees(126.99420, 37.51948, 0),
        billboard: {
          image: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
          width: 28,
          height: 28,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
        label: {
          text: "강변북로",
          font: "14pt sans-serif",
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(0, -35),
        },
      });

      // 카메라 초기 위치 (도로와 마커 잘 보이도록)
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(126.99447, 37.51872, 150), // 위에서 150m 상공
        orientation: {
          heading: Cesium.Math.toRadians(0),     // 북쪽 정면
          pitch: Cesium.Math.toRadians(-45),     // 아래로 45도
          roll: 0,
        },
      });
    };

    initViewer();

    return () => {
      if (viewer) viewer.destroy();
    };
  }, []);

  return <div ref={viewerRef} style={{ width: "100%", height: "90vh" }} />;
};

export default CesiumJSRoadPage2;
