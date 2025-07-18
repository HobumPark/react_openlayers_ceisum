import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium/Cesium.js";
import "cesium/Widgets/widgets.css";

window.CESIUM_BASE_URL = "/cesium";

// ✅ 토큰은 문제없다면 그대로 사용
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNTBkMmVlOS0zNjhlLTRjNDAtOTQ1ZC0zZmRiN2E4Njc1NjAiLCJpZCI6MzIyMjkzLCJpYXQiOjE3NTI4MDc5MTJ9.LA_gnWHZT7la_IyF-jImYgspmAmlmUo9HXejM2P7R5E";

const CesiumJSFullPage = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
    let viewer;

    const initViewer = async () => {
      const terrain = await Cesium.createWorldTerrainAsync();

      viewer = new Cesium.Viewer(viewerRef.current, {
        terrainProvider: terrain, // 
      });

      viewer.scene.globe.enableLighting = false;

      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(128.62681, 35.86697, 15000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0,
        },
      });

      viewer.scene.imageryLayers.layerAdded.addEventListener(() => {
        console.log("Imagery Layer 로딩됨");
      });

      console.log("🌍 TerrainProvider: ", viewer.terrainProvider);
    };

    initViewer();

    return () => {
      if (viewer) viewer.destroy();
    };
  }, []);

  return <div ref={viewerRef} style={{ width: "100%", height: "90vh" }} />;
};

export default CesiumJSFullPage;
