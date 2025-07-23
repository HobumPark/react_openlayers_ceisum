// useMapFilters.js
import { useState, useEffect } from 'react';

const DEFAULT_FILTERS = {
  saturation: 1,
  contrast: 1,
  brightness: 1,
  blur: 0,
  hueRotate: 0,
  invert: 0,
  grayscale: 0,
  sepia: 0,
};

export function useMapFilters(mapContainerSelector = null) {
  // filters: 현재 필터 값들
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  // savedFilters: 저장된 필터 값들
  const [savedFilters, setSavedFilters] = useState(DEFAULT_FILTERS);

  // 개별 필터 변경 함수들
  const setSaturation = (value) => setFilters((f) => ({ ...f, saturation: value }));
  const setContrast = (value) => setFilters((f) => ({ ...f, contrast: value }));
  const setBrightness = (value) => setFilters((f) => ({ ...f, brightness: value }));
  const setBlur = (value) => setFilters((f) => ({ ...f, blur: value }));
  const setHueRotate = (value) => setFilters((f) => ({ ...f, hueRotate: value }));
  const setInvert = (value) => setFilters((f) => ({ ...f, invert: value }));
  const setGrayscale = (value) => setFilters((f) => ({ ...f, grayscale: value }));
  const setSepia = (value) => setFilters((f) => ({ ...f, sepia: value }));

  // 필터 초기화
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  // 필터 저장
  const saveFilters = () => setSavedFilters(filters);

  // 저장된 필터 적용
  const applyFilters = () => setFilters(savedFilters);

  // mapContainerSelector가 있으면 해당 요소 내 모든 canvas에 필터 스타일 적용
  useEffect(() => {
    if (!mapContainerSelector) return;

    const container = document.querySelector(mapContainerSelector);
    if (!container) return;

    const canvases = container.querySelectorAll('canvas');
    const {
      saturation,
      contrast,
      brightness,
      blur,
      hueRotate,
      invert,
      grayscale,
      sepia,
    } = filters;

    const filterStyle = `
      saturate(${saturation})
      contrast(${contrast})
      brightness(${brightness})
      blur(${blur}px)
      hue-rotate(${hueRotate}deg)
      invert(${invert})
      grayscale(${grayscale})
      sepia(${sepia})
    `;

    canvases.forEach((canvas) => {
      canvas.style.filter = filterStyle;
    });

  }, [filters, mapContainerSelector]);

  return {
    filters,
    setFilters,
    savedFilters,
    setSavedFilters,
    resetFilters,
    saveFilters,
    applyFilters,
    setSaturation,
    setContrast,
    setBrightness,
    setBlur,
    setHueRotate,
    setInvert,
    setGrayscale,
    setSepia,
  };
}
