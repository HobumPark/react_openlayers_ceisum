import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map'; // ← 이름 변경
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls, Zoom } from 'ol/control';
import 'ol/ol.css';

const DAEGU_CENTER = fromLonLat([128.6018, 35.8714]); // 대구광역시 중심 좌표

const CesiumJSPartialPage = () => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isDarkMap, setIsDarkMap] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const defaultLayer = new TileLayer({
      source: new OSM(),
    });

    const darkLayer = new TileLayer({
      visible: false,
      source: new XYZ({
        url: 'https://tiles.stadiamaps.com/tiles/alidade_dark/{z}/{x}/{y}{r}.png',
        attributions: '© Stadia Maps',
      }),
    });

    const map = new Map({
      target: mapRef.current,
      layers: [defaultLayer, darkLayer],
      view: new View({
        center: DAEGU_CENTER,
        zoom: 12,
      }),
      controls: defaultControls().extend([new Zoom()]),
    });

    setMapInstance(map);

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // 다크맵 토글
  const toggleMapStyle = () => {
    if (!mapInstance) return;
    const layers = mapInstance.getLayers().getArray();
    layers[0].setVisible(!isDarkMap); // 일반맵
    layers[1].setVisible(isDarkMap); // 다크맵
    setIsDarkMap(!isDarkMap);
  };

  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '800px', border: '1px solid #ccc' }}
      ></div>
    </div>
  );
};

export default CesiumJSPartialPage;
