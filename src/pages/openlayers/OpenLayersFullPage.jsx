import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls, Zoom } from 'ol/control';
import { Draw } from 'ol/interaction';
import { getLength } from 'ol/sphere';
import 'ol/ol.css';
import OpenLayersGlobalControlBox from './controlbox/OpenLayersGlobalControlBox';
import './css/OpenLayersFullPage.css';

import osmDefaultImg from '../../assets/map/icon-default.svg';
import darkMapImg from '../../assets/map/icon-dark-map.svg';
import openMapTilesImg from '../../assets/map/maptiler-logo-icon.png';
import Colorize from 'ol-ext/filter/Colorize';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';

const VWORLD_API_KEY = "5363C20D-EDEA-3436-88BC-B45CC374A9B4";

const DAEGU_CENTER = fromLonLat([128.6018, 35.8714]);

const DEFAULT_FILTERS = {
  saturation: 1,
  contrast: 1,
  brightness: 1,
  blur: 0,
  hueRotate: 0,
  invert: 0,
  grayscale: 0,
  sepia: 0
};

const OpenLayersFullPage = () => {

  // 설정 저장 상태
  const [savedFilters, setSavedFilters] = useState(DEFAULT_FILTERS);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const defaultOsmLayerRef = useRef(null);
  const vWorldLayerRef = useRef(null);
  const vWorldDarkLayerRef = useRef(null);
  const openMapTilesRasterLayerRef  = useRef(null);
  const cartoDBLayerRef = useRef(null);
  const cartoDBDarkLayerRef = useRef(null);
  const thunderForestLayerRef = useRef(null);

  const vectorSourceRef = useRef(new VectorSource());
  const vectorLayerRef = useRef(null);

  const [isDarkMap, setIsDarkMap] = useState(false);
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const [saturation, setSaturation] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const [blur, setBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [invert, setInvert] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);

  const handleSaturationChange = (value) => setSaturation(value);
  const handleContrastChange = (value) => setContrast(value);
  const handleBrightnessChange = (value) => setBrightness(value);
  const handleBlurChange = (value) => setBlur(value);
  const handleHueRotateChange = (value) => setHueRotate(value);
  const handleInvertChange = (value) => setInvert(value);
  const handleGrayscaleChange = (value) => setGrayscale(value);
  const handleSepiaChange = (value) => setSepia(value);

  // 초기화
  const resetFilters = () => {
    setSaturation(DEFAULT_FILTERS.saturation);
    setContrast(DEFAULT_FILTERS.contrast);
    setBrightness(DEFAULT_FILTERS.brightness);
    setBlur(DEFAULT_FILTERS.blur);
    setHueRotate(DEFAULT_FILTERS.hueRotate);
    setInvert(DEFAULT_FILTERS.invert);
    setGrayscale(DEFAULT_FILTERS.grayscale);
  };

  // 저장
  const saveCurrentFilters = () => {
    setSavedFilters({
      saturation,
      contrast,
      brightness,
      blur,
      hueRotate,
      invert,
      grayscale,
      sepia
    });
  };

  // 저장된 설정으로 복원
  const applySavedFilters = () => {
    setSaturation(savedFilters.saturation);
    setContrast(savedFilters.contrast);
    setBrightness(savedFilters.brightness);
    setBlur(savedFilters.blur);
    setHueRotate(savedFilters.hueRotate);
    setInvert(savedFilters.invert);
    setGrayscale(savedFilters.grayscale);
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const mapDiv = mapRef.current;
    mapDiv.querySelectorAll('canvas').forEach((canvas) => {
      canvas.style.filter = `
      saturate(${saturation})
      contrast(${contrast})
      brightness(${brightness})
      blur(${blur}px)
      hue-rotate(${hueRotate}deg)
      invert(${invert})
      grayscale(${grayscale})
      sepia(${sepia})
    `;
    });
  }, [saturation, contrast, brightness, blur, hueRotate, invert, grayscale, sepia]);

  useEffect(() => {
    if (!mapRef.current) return;

    defaultOsmLayerRef.current = new TileLayer({
      title: 'osm-default',
      source: new OSM(),
      opacity: 1,
    });

    vWorldLayerRef.current = new TileLayer({
      title: 'vworld-default',
      visible: false,
      type: 'base',
      source: new XYZ({
        url: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_API_KEY}/Base/{z}/{y}/{x}.png`,
        attributions: '© VWorld',
      }),
    });

    vWorldDarkLayerRef.current = new TileLayer({
      title: 'vworld-dark',
      visible: false,
      type: 'base',
      source: new XYZ({
        url: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_API_KEY}/Base/{z}/{y}/{x}.png`,
        attributions: '© VWorld',
      }),
    });

    openMapTilesRasterLayerRef.current = new TileLayer({
      source: new XYZ({
        url: 'https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=XLpeaVkcWxtAYdW1mfE2'
      }),
      visible: false,
      title: 'openmaptiles',
    });

    cartoDBLayerRef.current = new TileLayer({
      source: new XYZ({
        url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
      }),
      visible: false,  // 처음에는 숨김 상태로 시작하는 게 일반적입니다
      title: 'carto-db'
    });

    cartoDBDarkLayerRef.current = new TileLayer({
      source: new XYZ({
        url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
      }),
      visible: false,  // 처음에는 숨김 상태로 시작하는 게 일반적입니다
      title: 'carto-db-dark'
    });

    thunderForestLayerRef.current = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=30f1e016bf1f4c568252d56cfd445a95'
      }),
      visible: false,  // 처음에는 숨김 상태로 시작하는 게 일반적입니다
      title: 'carto-db'
    });

    // 필터 생성
    const darkFilter = new Colorize();
    darkFilter.setFilter({
      operation: "color",
      red: 20,      // 낮은 빨강
      green: 20,    // 낮은 초록
      blue: 20,     // 낮은 파랑 (어두운 회색 계열)
      value: 0.6,   // 영향력 강도 (0.0 ~ 1.0)
    });
    vWorldDarkLayerRef.current.addFilter(darkFilter);

    vectorLayerRef.current = new VectorLayer({
      source: vectorSourceRef.current,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        defaultOsmLayerRef.current,
        vWorldLayerRef.current,
        vWorldDarkLayerRef.current,
        vectorLayerRef.current,
        openMapTilesRasterLayerRef.current,
        cartoDBLayerRef.current,
        cartoDBDarkLayerRef.current,
        thunderForestLayerRef.current,
      ],
      view: new View({
        center: DAEGU_CENTER,
        zoom: 12,
      }),
      controls: defaultControls().extend([new Zoom()]),
    });

    //다크맵 토글 버튼 생성 및 추가


    createCustomButton(osmDefaultImg, osmMapStyle, 'osm', 'open street map');
    createCustomButton(null, vWorldMapStyle, 'vworld', 'v-world');
    createCustomButton(darkMapImg, vworldDarkMapStyle, 'v-world + dark', 'v-world + dark');
    createCustomButton(openMapTilesImg, openMapTilesMapStyle, 'open map tiles', 'open map tiles');
    createCustomButton(null, cartoDBMapStyle, 'carto', 'carto-db');
    createCustomButton(null, cartoDBDarkMapStyle, 'carto', 'carto-db-dark');
    createCustomButton(null, thunderForestMapStyle, 'thunder', 'thunder forest');

    mapInstanceRef.current = map;

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // 커스텀 버튼 생성 함수
  const createCustomButton = (iconSrc, onClick, textLabel = 'Button' , title='Button') => {
    const control = document.querySelector('.ol-zoom');
    const button = document.createElement('button');

    if (iconSrc) {
      // 이미지 엘리먼트 생성
      const img = document.createElement('img');
      img.src = iconSrc;
      img.alt = 'custom-icon';
      img.style.width = '20px';
      img.style.height = '20px';
      button.appendChild(img);
    } else {
      // 텍스트만 표시
      button.innerText = textLabel;
    }

    // 툴팁용 title 속성 추가
    button.title = title;

    // 공통 스타일
    button.style.padding = '4px';
    button.style.color = '#fff';
    button.style.background = '#777';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '4px';
    button.style.marginLeft = '4px';
    button.style.fontSize = '12px';
    button.style.fontWeight = 'normal';
    button.addEventListener('click', onClick);
    control.appendChild(button); openMapTilesMapStyle
  };


  // 모든 베이스맵 레이어 숨기기
  const hideAllBaseLayers = () => {
    defaultOsmLayerRef.current.setVisible(false);
    vWorldLayerRef.current.setVisible(false);
    vWorldDarkLayerRef.current.setVisible(false);
    openMapTilesRasterLayerRef.current.setVisible(false);
    cartoDBLayerRef.current.setVisible(false);
    cartoDBDarkLayerRef.current.setVisible(false);
    thunderForestLayerRef.current.setVisible(false);
  };

  const osmMapStyle = () => {
    hideAllBaseLayers();
    defaultOsmLayerRef.current.setVisible(true);
  };

  const vWorldMapStyle = () => {
    hideAllBaseLayers();
    vWorldLayerRef.current.setVisible(true);
  };

  const vworldDarkMapStyle = () => {
    if (!mapInstanceRef.current) return;
    hideAllBaseLayers();
    vWorldDarkLayerRef.current.setVisible(true);
  };

  const openMapTilesMapStyle = () => {
    hideAllBaseLayers();
    openMapTilesRasterLayerRef.current.setVisible(true);
  };

  const cartoDBMapStyle = () => {
    hideAllBaseLayers();
    cartoDBLayerRef.current.setVisible(true);
  };

  const cartoDBDarkMapStyle = () => {
    hideAllBaseLayers();
    cartoDBDarkLayerRef.current.setVisible(true);
  };

  const thunderForestMapStyle = () => {
    hideAllBaseLayers();
    thunderForestLayerRef.current.setVisible(true);
  };

  // 투명도 변경
  const handleOpacityChange = (opacity) => {
    if (!defaultOsmLayerRef.current) return;
    defaultOsmLayerRef.current.setOpacity(opacity);
  };

  // 회전
  const rotateMap = (deg) => {
    if (!mapInstanceRef.current) return;
    const view = mapInstanceRef.current.getView();
    const currentRotation = view.getRotation() || 0;
    view.setRotation(currentRotation + (deg * Math.PI) / 180);
  };
  const onRotateLeft = () => rotateMap(-10);
  const onRotateRight = () => rotateMap(10);

  // 그리기
  const addDrawInteraction = (geometryType) => {
    if (!mapInstanceRef.current) return;

    if (drawInteraction) {
      mapInstanceRef.current.removeInteraction(drawInteraction);
      setDrawInteraction(null);
    }

    const draw = new Draw({
      source: vectorSourceRef.current,
      type: geometryType,
    });

    mapInstanceRef.current.addInteraction(draw);
    setDrawInteraction(draw);

    draw.on('drawend', () => {
      mapInstanceRef.current.removeInteraction(draw);
      setDrawInteraction(null);
    });
  };
  const onDrawLine = () => addDrawInteraction('LineString');
  const onDrawPolygon = () => addDrawInteraction('Polygon');

  // 초기화
  const onClearDraw = () => {
    vectorSourceRef.current.clear();
    if (drawInteraction && mapInstanceRef.current) {
      mapInstanceRef.current.removeInteraction(drawInteraction);
      setDrawInteraction(null);
    }
    setIsMeasuring(false);
  };

  // 거리 측정
  const onToggleMeasure = () => {
    if (!mapInstanceRef.current) return;

    if (isMeasuring) {
      if (drawInteraction) {
        mapInstanceRef.current.removeInteraction(drawInteraction);
        setDrawInteraction(null);
      }
      setIsMeasuring(false);
      vectorSourceRef.current.clear();
    } else {
      if (drawInteraction) {
        mapInstanceRef.current.removeInteraction(drawInteraction);
      }
      const draw = new Draw({
        source: vectorSourceRef.current,
        type: 'LineString',
      });
      mapInstanceRef.current.addInteraction(draw);
      setDrawInteraction(draw);
      setIsMeasuring(true);

      draw.on('drawend', (event) => {
        const geom = event.feature.getGeometry();
        const length = getLength(geom);
        alert(`측정 길이: ${(length / 1000).toFixed(2)} km`);
        mapInstanceRef.current.removeInteraction(draw);
        setDrawInteraction(null);
        setIsMeasuring(false);
      });
    }
  };

  return (
    <div style={{ display: 'flex', height: '800px', border: '1px solid #ccc' }}>
      <div ref={mapRef} style={{ flex: '0 0 80%', height: '100%' }} />
      <div style={{ flex: '0 0 20%', padding: '10px', boxSizing: 'border-box' }}>
        <OpenLayersGlobalControlBox
          onResetFilters={resetFilters}
          onSaveFilters={saveCurrentFilters}
          onApplySavedFilters={applySavedFilters}
          onOpacityChange={handleOpacityChange}
          onSaturationChange={handleSaturationChange}
          onContrastChange={handleContrastChange}
          onBrightnessChange={handleBrightnessChange}
          onBlurChange={handleBlurChange}
          onHueRotateChange={handleHueRotateChange}
          onInvertChange={handleInvertChange}
          onGrayscaleChange={handleGrayscaleChange}
          onSepiaChange={handleSepiaChange}
          onRotateLeft={onRotateLeft}
          onRotateRight={onRotateRight}
          onDrawLine={onDrawLine}
          onDrawPolygon={onDrawPolygon}
          onClearDraw={onClearDraw}
          onToggleMeasure={onToggleMeasure}
          isMeasuring={isMeasuring}
          saturation={saturation}
          contrast={contrast}
          brightness={brightness}
          blur={blur}
          hueRotate={hueRotate}
          invert={invert}
          grayscale={grayscale}
          sepia={sepia}
        />

      </div>
    </div>
  );
};

export default OpenLayersFullPage;
