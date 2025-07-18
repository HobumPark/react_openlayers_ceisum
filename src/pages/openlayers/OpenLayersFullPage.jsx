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
  const defaultLayerRef = useRef(null);   // 투명도 조절용
  const darkLayerRef = useRef(null);
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

    defaultLayerRef.current = new TileLayer({
      source: new OSM(),
      opacity: 1,
    });

    darkLayerRef.current = new TileLayer({
      visible: false,
      source: new XYZ({
        url: 'https://tiles.stadiamaps.com/tiles/alidade_dark/{z}/{x}/{y}{r}.png',
        attributions: '© Stadia Maps',
      }),
    });

    vectorLayerRef.current = new VectorLayer({
      source: vectorSourceRef.current,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        defaultLayerRef.current,
        darkLayerRef.current,
        vectorLayerRef.current,
      ],
      view: new View({
        center: DAEGU_CENTER,
        zoom: 12,
      }),
      controls: defaultControls().extend([new Zoom()]),
    });

    mapInstanceRef.current = map;

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // 다크맵 토글
  const toggleMapStyle = () => {
    if (!mapInstanceRef.current) return;

    defaultLayerRef.current.setVisible(isDarkMap);
    darkLayerRef.current.setVisible(!isDarkMap);
    setIsDarkMap(!isDarkMap);
  };

  // 투명도 변경
  const handleOpacityChange = (opacity) => {
    if (!defaultLayerRef.current) return;
    defaultLayerRef.current.setOpacity(opacity);
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
            onBlurChange={handleBlurChange }
            onHueRotateChange={handleHueRotateChange }
            onInvertChange={handleInvertChange }
            onGrayscaleChange={handleGrayscaleChange  }
            onSepiaChange={handleSepiaChange  }
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
