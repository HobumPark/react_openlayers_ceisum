// useOpenLayersMap.js
import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls, Zoom } from 'ol/control';
import Colorize from 'ol-ext/filter/Colorize';

const VWORLD_API_KEY = "5363C20D-EDEA-3436-88BC-B45CC374A9B4";
const DAEGU_CENTER = fromLonLat([128.6018, 35.8714]);

export function useOpenLayersMap(mapRef) {
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({
    defaultOsmLayer: null,
    vWorldLayer: null,
    vWorldDarkLayer: null,
    openMapTilesRasterLayer: null,
    cartoDBLayer: null,
    cartoDBDarkLayer: null,
    thunderForestLayer: null,
    vectorLayer: null,
    vectorSource: new VectorSource(),
  });

  // 베이스맵 레이어 숨기기 함수
  const hideAllBaseLayers = () => {
    const {
      defaultOsmLayer,
      vWorldLayer,
      vWorldDarkLayer,
      openMapTilesRasterLayer,
      cartoDBLayer,
      cartoDBDarkLayer,
      thunderForestLayer,
    } = layersRef.current;

    if (defaultOsmLayer) defaultOsmLayer.setVisible(false);
    if (vWorldLayer) vWorldLayer.setVisible(false);
    if (vWorldDarkLayer) vWorldDarkLayer.setVisible(false);
    if (openMapTilesRasterLayer) openMapTilesRasterLayer.setVisible(false);
    if (cartoDBLayer) cartoDBLayer.setVisible(false);
    if (cartoDBDarkLayer) cartoDBDarkLayer.setVisible(false);
    if (thunderForestLayer) thunderForestLayer.setVisible(false);
  };

  // 특정 베이스맵 보이기 함수 (key는 layersRef의 키명)
  const showBaseLayer = (key) => {
    hideAllBaseLayers();
    const layer = layersRef.current[key];
    if (layer) layer.setVisible(true);
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // 레이어 생성
    layersRef.current.defaultOsmLayer = new TileLayer({
      title: 'osm-default',
      source: new OSM(),
      opacity: 1,
      visible: true,
    });

    layersRef.current.vWorldLayer = new TileLayer({
      title: 'vworld-default',
      source: new XYZ({
        url: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_API_KEY}/Base/{z}/{y}/{x}.png`,
        attributions: '© VWorld',
      }),
      visible: false,
      type: 'base',
    });

    layersRef.current.vWorldDarkLayer = new TileLayer({
      title: 'vworld-dark',
      source: new XYZ({
        url: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_API_KEY}/Base/{z}/{y}/{x}.png`,
        attributions: '© VWorld',
      }),
      visible: false,
      type: 'base',
    });

    // dark 필터 적용
    const darkFilter = new Colorize();
    darkFilter.setFilter({
      operation: "color",
      red: 20,
      green: 20,
      blue: 20,
      value: 0.6,
    });
    layersRef.current.vWorldDarkLayer.addFilter(darkFilter);

    layersRef.current.openMapTilesRasterLayer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: 'https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=XLpeaVkcWxtAYdW1mfE2',
      }),
      visible: false,
      title: 'openmaptiles',
    });

    layersRef.current.cartoDBLayer = new TileLayer({
      source: new XYZ({
        url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
      }),
      visible: false,
      title: 'carto-db',
    });

    layersRef.current.cartoDBDarkLayer = new TileLayer({
      source: new XYZ({
        url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
      }),
      visible: false,
      title: 'carto-db-dark',
    });

    layersRef.current.thunderForestLayer = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=30f1e016bf1f4c568252d56cfd445a95',
      }),
      visible: false,
      title: 'thunder-forest',
    });

    layersRef.current.vectorLayer = new VectorLayer({
      source: layersRef.current.vectorSource,
    });

    // 맵 인스턴스 생성
    const map = new Map({
      target: mapRef.current,
      layers: [
        layersRef.current.defaultOsmLayer,
        layersRef.current.vWorldLayer,
        layersRef.current.vWorldDarkLayer,
        layersRef.current.vectorLayer,
        layersRef.current.openMapTilesRasterLayer,
        layersRef.current.cartoDBLayer,
        layersRef.current.cartoDBDarkLayer,
        layersRef.current.thunderForestLayer,
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
  }, [mapRef]);

  return {
    mapInstanceRef,
    layersRef,
    hideAllBaseLayers,
    showBaseLayer,
  };
}
