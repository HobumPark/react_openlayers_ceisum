import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium/Cesium.js";
import "cesium/Widgets/widgets.css";

window.CESIUM_BASE_URL = "/cesium";

// ✅ 여기에 본인의 Cesium Ion Access Token을 넣으세요.
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YzVjZTU4ZS0zZmZlLTRmZTQtOGQxYi1kODRhMTZmZDdlOTUiLCJpZCI6MzIyMjkzLCJpYXQiOjE3NTI3MzcwMDJ9.BUglR6vPF_8160l9eCq-BijdmwWq53BseiEdCF2iGxE";

const CesiumJSFullPage = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
    const viewer = new Cesium.Viewer(viewerRef.current, {
      terrainProvider: new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(1),
      }),
      imageryProvider: new Cesium.IonImageryProvider({ assetId: 3 }),
      baseLayerPicker: false,
    });

    viewer.scene.globe.enableLighting = false;

    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(128.62681, 35.86697, 5000), // 5만m 높이로 변경
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0,
      },
    });


    viewer.scene.imageryLayers.layerAdded.addEventListener(() => {
      console.log("Imagery Layer 로딩됨");
    });

    return () => viewer.destroy();
  }, []);



  return <div ref={viewerRef} style={{ width: "100%", height: "90vh" }} />;
};

export default CesiumJSFullPage;
