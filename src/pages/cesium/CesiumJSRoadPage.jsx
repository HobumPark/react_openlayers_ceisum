import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium/Cesium.js";
import "cesium/Widgets/widgets.css";

window.CESIUM_BASE_URL = "/cesium";

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNTBkMmVlOS0zNjhlLTRjNDAtOTQ1ZC0zZmRiN2E4Njc1NjAiLCJpZCI6MzIyMjkzLCJpYXQiOjE3NTI4MDc5MTJ9.LA_gnWHZT7la_IyF-jImYgspmAmlmUo9HXejM2P7R5E";

const CesiumJSRoadPage = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
    let viewer;

    const initViewer = async () => {
      const terrain = await Cesium.createWorldTerrainAsync();

      viewer = new Cesium.Viewer(viewerRef.current, {
        terrainProvider: terrain,
      });

      viewer.scene.globe.enableLighting = false;

      // 대구벤처밸리 중심 좌표
      const centerLon = 128.62682;
      const centerLat = 35.86693;
      const height = 0;

      // 레이더 아이콘 URL
      const radarIconUrl =
        "https://cdn-icons-png.flaticon.com/512/1159/1159101.png";

      // 동서남북 좌표 (약 200m 차이)
      const offset = 0.002;

      const directions = {
        East: [centerLon + offset, centerLat, height],
        West: [centerLon - offset, centerLat, height],
        North: [centerLon, centerLat + offset, height],
        South: [centerLon, centerLat - offset, height],
      };

      // 동서남북 마커 추가
      Object.entries(directions).forEach(([dir, coord]) => {
        viewer.entities.add({
          name: `${dir} 레이더`,
          position: Cesium.Cartesian3.fromDegrees(...coord),
          billboard: {
            image: radarIconUrl,
            width: 28,
            height: 28,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          },
          label: {
            text: `${dir} 레이더`,
            font: "13pt sans-serif",
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(0, -35),
          },
        });
      });

      // 중심 마커도 추가
      viewer.entities.add({
        name: "대구벤처밸리로",
        position: Cesium.Cartesian3.fromDegrees(centerLon, centerLat),
        billboard: {
          image: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
          width: 28,
          height: 28,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
        label: {
          text: "대구벤처밸리로",
          font: "14pt sans-serif",
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(0, -35),
        },
        description: `
          <h3>대구벤처밸리로</h3>
          <p>대구 동구 동대구역 인근의 산업단지 지역입니다.</p>
        `,
      });

      // 도로 영역 사각형 좌표 (대략)
      const rectangleCoords = [
        [128.62461, 35.86726], // 
        [128.62611, 35.86715], // 
        [128.62609, 35.86693], // 
        [128.62461, 35.86708], // 
        
      ];

      const rectanglePositions = rectangleCoords.map(([lon, lat]) =>
        Cesium.Cartesian3.fromDegrees(lon, lat, 0)
      );

      viewer.entities.add({
        name: "벤처밸리 도로 영역",
        polygon: {
          hierarchy: rectanglePositions,
          material: Cesium.Color.GREEN.withAlpha(0.3),
          outline: true,
          outlineColor: Cesium.Color.GREEN,
          outlineWidth: 2,
          height: 0,
        },
      });

      // 카메라 초기 위치 및 방향 (도로 영역과 마커 모두 잘 보이도록)
      viewer.camera.setView({
        destination: Cesium.Rectangle.fromDegrees(
          128.6225,
          35.8635,
          128.6315,
          35.8705
        ),
      });
    };

    initViewer();

    return () => {
      if (viewer) viewer.destroy();
    };
  }, []);

  return <div ref={viewerRef} style={{ width: "100%", height: "90vh" }} />;
};

export default CesiumJSRoadPage;
