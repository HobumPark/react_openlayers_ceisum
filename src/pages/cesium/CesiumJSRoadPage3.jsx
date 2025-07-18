import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium/Cesium.js";
import "cesium/Widgets/widgets.css";

window.CESIUM_BASE_URL = "/cesium";

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNTBkMmVlOS0zNjhlLTRjNDAtOTQ1ZC0zZmRiN2E4Njc1NjAiLCJpZCI6MzIyMjkzLCJpYXQiOjE3NTI4MDc5MTJ9.LA_gnWHZT7la_IyF-jImYgspmAmlmUo9HXejM2P7R5E";

const CesiumJSRoadPage3 = () => {
  const viewerRef = useRef(null);
  const vehiclesRef = useRef([]); // 차량 엔티티 저장
  const vehiclePositionsRef = useRef([]); // 차량 좌표 저장

  useEffect(() => {
    let viewer;
    let intervalId;

    const firstFloorCoords = [
      [126.99332, 37.51924],
      [126.99470, 37.51983],
      [126.99476, 37.51968],
      [126.99345, 37.51915],
    ];

    // 사각형 영역 최소 최대 좌표 (대략)
    const minLon = 126.99332;
    const maxLon = 126.99476;
    const minLat = 37.51915;
    const maxLat = 37.51983;

    // 차량 수
    const vehicleCount = 5;

    const randomPositionInBounds = () => {
      const lon = minLon + Math.random() * (maxLon - minLon);
      const lat = minLat + Math.random() * (maxLat - minLat);
      return [lon, lat];
    };

    const initViewer = async () => {
      const terrain = await Cesium.createWorldTerrainAsync();

      viewer = new Cesium.Viewer(viewerRef.current, {
        terrainProvider: terrain,
      });

      viewer.scene.globe.enableLighting = false;

      // 1층 도로 폴리곤 (기존)
      const firstFloorPositions = firstFloorCoords.map(([lon, lat]) =>
        Cesium.Cartesian3.fromDegrees(lon, lat, 0)
      );

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

      // 차량 엔티티 생성
      vehiclesRef.current = [];
      vehiclePositionsRef.current = [];

      for (let i = 0; i < vehicleCount; i++) {
        const [lon, lat] = randomPositionInBounds();
        vehiclePositionsRef.current.push([lon, lat]);

        const vehicleEntity = viewer.entities.add({
          id: `vehicle_${i}`,
          name: `차량 ${i + 1}`,
          position: Cesium.Cartesian3.fromDegrees(lon, lat, 1), // 지면 약간 위
          billboard: {
            image:
              "https://cdn-icons-png.flaticon.com/512/743/743922.png",
            width: 32,
            height: 32,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          },
          label: {
            text: `차량 ${i + 1}`,
            font: "12pt sans-serif",
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(0, -40),
          },
        });

        vehiclesRef.current.push(vehicleEntity);
      }

      // 카메라 위치 설정
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(126.99447, 37.51872, 150),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0,
        },
      });

      // 1초마다 차량 위치 업데이트 시뮬레이션
      intervalId = setInterval(() => {
        vehiclePositionsRef.current = vehiclePositionsRef.current.map(([lon, lat]) => {
          // 조금씩 이동 (±0.00005도 정도)
          let newLon = lon + (Math.random() - 0.5) * 0.0001;
          let newLat = lat + (Math.random() - 0.5) * 0.0001;

          // 사각형 영역 내 제한
          newLon = Math.min(Math.max(newLon, minLon), maxLon);
          newLat = Math.min(Math.max(newLat, minLat), maxLat);

          return [newLon, newLat];
        });

        // 엔티티 위치 업데이트
        vehiclePositionsRef.current.forEach(([lon, lat], i) => {
          const pos = Cesium.Cartesian3.fromDegrees(lon, lat, 1);
          vehiclesRef.current[i].position = pos;
        });
      }, 1000);
    };

    initViewer();

    return () => {
      if (viewer) viewer.destroy();
      clearInterval(intervalId);
    };
  }, []);

  return <div ref={viewerRef} style={{ width: "100%", height: "90vh" }} />;
};

export default CesiumJSRoadPage3;
