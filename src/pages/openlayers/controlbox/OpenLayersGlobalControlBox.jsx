import React, { useState } from 'react';

const OpenLayersGlobalControlBox = ({
  onResetFilters,
  onSaveFilters,
  onApplySavedFilters,
  onOpacityChange,
  onSaturationChange,
  onContrastChange,
  onBrightnessChange,
  onBlurChange,
  onHueRotateChange,
  onInvertChange,
  onGrayscaleChange,
  onSepiaChange,
  onRotateLeft,
  onRotateRight,
  onDrawLine,
  onDrawPolygon,
  onClearDraw,
  onToggleMeasure,
  isMeasuring,
  saturation,
  contrast,
  brightness,
  blur,
  hueRotate,
  invert,
  grayscale,
  sepia
}) => {
  const [opacity, setOpacity] = useState(1);

  const handleOpacityChange = (e) => {
    const value = parseFloat(e.target.value);
    setOpacity(value);
    onOpacityChange(value);
  };

  return (
    <div
      style={{
        width: '85%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: 5,
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        fontSize: 14,
        margin:"0 auto",
      }}
    >
      <button onClick={onResetFilters} style={{ display: 'block', margin: '10px auto' }}>
        기본값으로
      </button>
      <button onClick={onSaveFilters} style={{ display: 'block', margin: '10px auto' }}>
        설정 저장
      </button>
      <button onClick={onApplySavedFilters} style={{ display: 'block', margin: '10px auto' }}>
        저장된 설정 불러오기
      </button>

      <label style={{ display: 'block', marginBottom: 15 }}>
        투명도: {opacity.toFixed(1)}
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={handleOpacityChange}
          style={{ width: '100%', marginTop: 5 }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 15 }}>
        채도: {saturation.toFixed(2)}
        <input
          type="range"
          min="0"
          max="3"
          step="0.01"
          value={saturation}
          onChange={e => onSaturationChange(parseFloat(e.target.value))}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 15 }}>
        대비: {contrast.toFixed(2)}
        <input
          type="range"
          min="0"
          max="3"
          step="0.01"
          value={contrast}
          onChange={e => onContrastChange(parseFloat(e.target.value))}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 15 }}>
        밝기: {brightness.toFixed(2)}
        <input
          type="range"
          min="0"
          max="3"
          step="0.01"
          value={brightness}
          onChange={e => onBrightnessChange(parseFloat(e.target.value))}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 15 }}>
        흐림: {blur}px
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={blur}
          onChange={e => onBlurChange(parseFloat(e.target.value))}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 15 }}>
        색조 회전: {hueRotate}°
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={hueRotate}
          onChange={e => onHueRotateChange(parseInt(e.target.value))}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 15 }}>
        반전: {invert.toFixed(2)}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={invert}
          onChange={e => onInvertChange(parseFloat(e.target.value))}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 15 }}>
        그레이스케일: {grayscale.toFixed(2)}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={grayscale}
          onChange={e => onGrayscaleChange(parseFloat(e.target.value))}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 15 }}>
        세피아: {sepia.toFixed(2)}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={sepia}
          onChange={e => onSepiaChange(parseFloat(e.target.value))}
        />
      </label>

      <div
        style={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <button onClick={onRotateLeft}>⟲ 좌회전</button>
        <button onClick={onRotateRight}>⟳ 우회전</button>
      </div>

      <div
        style={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <button onClick={onDrawLine}>선 그리기</button>
        <button onClick={onDrawPolygon}>다각형 그리기</button>
      </div>

      <div
        style={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <button onClick={onClearDraw}>그리기 초기화</button>
        <button onClick={onToggleMeasure}>
          {isMeasuring ? '측정 종료' : '거리 측정'}
        </button>
      </div>
    </div>
  );
};

export default OpenLayersGlobalControlBox;
