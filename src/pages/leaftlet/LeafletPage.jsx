import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

import OpenStreetMapImg from '../../assets/map/icon-default.svg';
import DarkMapImg from '../../assets/map/icon-dark-map.svg';
import MapTilerImg from '../../assets/map/maptiler-logo-icon.png';

const DAEGU_CENTER = [35.8714, 128.6018];

const DEFAULT_STYLE = {
  color: '#3388ff',
  weight: 3,
  opacity: 1.0,
  fillColor: '#3388ff',
  fillOpacity: 0.2,
};

const TILE_LAYERS = {
  osm: {
    title: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    icon: OpenStreetMapImg,
  },
  cartoDB: {
    title: 'CartoDB Light',
    url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    attribution: '&copy; CartoDB',
    icon: null,
  },
  cartoDBDark: {
    title: 'CartoDB Dark',
    url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
    attribution: '&copy; CartoDB',
    icon: DarkMapImg,
  },
  thunderforest: {
    title: 'Thunderforest Landscape',
    url: 'https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=30f1e016bf1f4c568252d56cfd445a95',
    attribution: '&copy; Thunderforest',
    icon: null,
  },
  maptiler: {
    title: 'MapTiler',
    url: 'https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=XLpeaVkcWxtAYdW1mfE2',
    attribution: '&copy; MapTiler',
    icon: MapTilerImg,
  },
};

const LeafletPage = () => {
  const mapRef = useRef(null);
  const layersRef = useRef({});
  const drawControlRef = useRef(null);
  const drawnItemsRef = useRef(null);

  const [currentLayer, setCurrentLayer] = useState('osm');
  const [opacity, setOpacity] = useState(1);

  // 필터 상태
  const [saturation, setSaturation] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [blur, setBlur] = useState(0);

  useEffect(() => {
    mapRef.current = L.map('leaflet-map', {
      center: DAEGU_CENTER,
      zoom: 12,
      zoomControl: false,
    });

    drawnItemsRef.current = new L.FeatureGroup();
    mapRef.current.addLayer(drawnItemsRef.current);

    Object.entries(TILE_LAYERS).forEach(([key, layer]) => {
      layersRef.current[key] = L.tileLayer(layer.url, {
        attribution: layer.attribution,
        opacity: key === currentLayer ? opacity : 0,
      }).addTo(mapRef.current);
    });

    L.control.zoom({ position: 'topright' }).addTo(mapRef.current);

    drawControlRef.current = new L.Control.Draw({
      edit: {
        featureGroup: drawnItemsRef.current,
        remove: true,
      },
      draw: {
        polyline: true,
        polygon: true,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });
    mapRef.current.addControl(drawControlRef.current);

    mapRef.current.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;
      drawnItemsRef.current.addLayer(layer);

      if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
        const latlngs = layer.getLatLngs();
        let distance = 0;
        for (let i = 1; i < latlngs.length; i++) {
          distance += latlngs[i - 1].distanceTo(latlngs[i]);
        }
        alert(`측정 길이: ${(distance / 1000).toFixed(2)} km`);
      }
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    const tiles = document.querySelectorAll('.leaflet-tile');
    tiles.forEach((tile) => {
      tile.style.filter = `
        saturate(${saturation}%)
        contrast(${contrast}%)
        brightness(${brightness}%)
        blur(${blur}px)
      `;
    });
  }, [saturation, contrast, brightness, blur]);

  const changeLayer = (key) => {
    if (!layersRef.current[key] || !mapRef.current) return;
    Object.entries(layersRef.current).forEach(([layerKey, layer]) => {
      if (layerKey === key) {
        layer.setOpacity(opacity);
        layer.addTo(mapRef.current);
      } else {
        layer.setOpacity(0);
        mapRef.current.removeLayer(layer);
      }
    });
    setCurrentLayer(key);
  };

  const handleOpacityChange = (e) => {
    const val = Number(e.target.value);
    setOpacity(val);
    if (layersRef.current[currentLayer]) {
      layersRef.current[currentLayer].setOpacity(val);
    }
  };

  const resetDrawingStyles = () => {
  if (!drawnItemsRef.current) return;

  drawnItemsRef.current.eachLayer((layer) => {
    if (layer.setStyle) {
      layer.setStyle(DEFAULT_STYLE);
    }
  });

  // 필터 초기화
  setOpacity(1);
  setSaturation(100);
  setContrast(100);
  setBrightness(100);
  setBlur(0);
};

  return (
    <div style={{ display: 'flex', height: '800px', border: '1px solid #ccc' }}>
      <div id="leaflet-map" style={{ flex: '0 0 80%', height: '100%' }} />
      <div
        style={{
          flex: '0 0 20%',
          padding: '10px',
          boxSizing: 'border-box',
          background: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <h3>지도 스타일 선택</h3>
        {Object.entries(TILE_LAYERS).map(([key, layer]) => (
          <button
            key={key}
            onClick={() => changeLayer(key)}
            style={{
              backgroundColor: currentLayer === key ? '#007bff' : '#777',
              color: '#fff',
              border: 'none',
              padding: '8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
            title={layer.title}
          >
            {layer.icon && (
              <img src={layer.icon} alt="icon" style={{ width: '20px', height: '20px' }} />
            )}
            {layer.title}
          </button>
        ))}

        <div>
          <label htmlFor="opacity-range">투명도: {opacity}</label>
          <input
            id="opacity-range"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opacity}
            onChange={handleOpacityChange}
            style={{ width: '100%' }}
          />
        </div>

        <hr />
        <div>
          <label>채도(Saturation): {saturation}%</label>
          <input
            type="range"
            min="0"
            max="200"
            value={saturation}
            onChange={(e) => setSaturation(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label>대비(Contrast): {contrast}%</label>
          <input
            type="range"
            min="50"
            max="200"
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label>밝기(Brightness): {brightness}%</label>
          <input
            type="range"
            min="50"
            max="200"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label>흐림(Blur): {blur}px</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <button
          onClick={resetDrawingStyles}
          style={{
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            padding: '8px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          그리기 초기화
        </button>
      </div>
    </div>
  );
};

export default LeafletPage;
