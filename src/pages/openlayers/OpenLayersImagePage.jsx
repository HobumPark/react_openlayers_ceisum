import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import OpenLayersImageControlBox from './controlbox/OpenLayersImageControlBox';

const VENTURE_VALLEY_CENTER = fromLonLat([128.6404, 35.8865]); // 대구 동구 벤처벨리

const OpenLayersPartialPage = () => {
  const mapRef = useRef(null);
  const defaultLayerRef = useRef(null);
  const overlayRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isLayerVisible, setIsLayerVisible] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return;

    defaultLayerRef.current = new TileLayer({
      source: new OSM(),
      visible: true,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [defaultLayerRef.current],
      view: new View({
        center: VENTURE_VALLEY_CENTER,
        zoom: 12,
        minZoom: 12,
        maxZoom: 12,
        extent: [
          ...fromLonLat([128.62422, 35.86546]), // 좌하 (minX, minY)
          ...fromLonLat([128.62932, 35.86834]), // 우상 (maxX, maxY)
        ],
      }),
      controls: [],         // 컨트롤 제거
      interactions: [],     // 마우스 줌, 이동 등 비활성화
    });

    // Overlay 생성 (초기엔 빈 div)
    const overlayContainer = document.createElement('div');
    overlayContainer.style.position = 'absolute';
    overlayContainer.style.top = '0';
    overlayContainer.style.left = '0';
    overlayContainer.style.width = '100vw';
    overlayContainer.style.height = '100vh';
    overlayContainer.style.pointerEvents = 'none'; // 지도 조작 방해하지 않도록
    overlayContainer.style.zIndex = '999';

    const overlay = new Overlay({
      element: overlayContainer,
      positioning: 'top-left',
      stopEvent: false,
    });

    map.addOverlay(overlay);
    overlayRef.current = overlay;


    
    setMapInstance(map);

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // 레이어 보이기/숨기기 토글
  const toggleLayerVisibility = () => {
    if (!defaultLayerRef.current) return;
    const newVisibility = !isLayerVisible;
    defaultLayerRef.current.setVisible(newVisibility);
    setIsLayerVisible(newVisibility);
  };

  // 이미지 업로드 처리: Overlay에 이미지 띄우기
  const handleUploadImage = (file) => {
    if (!file || !mapInstance || !overlayRef.current) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imgSrc = reader.result;

      const overlayElement = overlayRef.current.getElement();
      overlayElement.innerHTML = ''; // 기존 내용 제거

      const img = document.createElement('img');
      img.src = imgSrc;

      // 화면 전체 덮도록 스타일 적용
      img.style.position = 'absolute';
      img.style.top = 0;
      img.style.left = 0;
      img.style.width = '100vw';
      img.style.height = '100vh';
      img.style.objectFit = 'cover';
      img.style.pointerEvents = 'none';

      overlayElement.appendChild(img);

      // Overlay 위치는 지도 중심으로 고정 (실제 위치 의미 없고 전체 화면 덮으려는 용도)
      //overlayRef.current.setPosition(mapInstance.getView().getCenter());
      const extent = mapInstance.getView().calculateExtent(mapInstance.getSize());
      const topLeft = [extent[0], extent[3]];  // minX, maxY

      overlayRef.current.setPosition(topLeft);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', height: '800px', border: '1px solid #ccc', position: 'relative' }}>
      <div ref={mapRef} style={{ flex: '0 0 80%', height: '100%' }} />
      <div style={{ flex: '0 0 20%', padding: '10px', boxSizing: 'border-box', position: 'relative' }}>
        <OpenLayersImageControlBox
          onUploadImage={handleUploadImage}
          onToggleLayer={toggleLayerVisibility}
          isLayerVisible={isLayerVisible}
        />
      </div>
    </div>
  );
};

export default OpenLayersPartialPage;
