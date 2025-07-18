import React, { useState } from 'react';

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const OpenLayersImageControlBox = ({ onUploadImage, onToggleLayer, isLayerVisible }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    setErrorMessage('');
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('허용되지 않는 파일 형식입니다. (jpg, png, gif 만 가능)');
      e.target.value = null;
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`파일 크기는 최대 ${MAX_SIZE_MB}MB까지 허용됩니다.`);
      e.target.value = null;
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadClick = async () => {
    setErrorMessage('');
    if (!selectedFile) {
      setErrorMessage('파일을 먼저 선택해주세요.');
      return;
    }

    if (onUploadImage) {
      setIsUploading(true);
      try {
        // onUploadImage가 비동기 함수라 가정
        await onUploadImage(selectedFile);
        setSelectedFile(null);
      } catch (error) {
        setErrorMessage('업로드 실패했습니다. 다시 시도해주세요.');
      }
      setIsUploading(false);
    }
  };

  const handleToggleLayer = () => {
    onToggleLayer?.();
  };

  return (
    <div
      style={{
        position: 'absolute',  // 추가: 절대 위치 고정
        top: '10px',           // 위에서 10px
        right: '10px',         // 오른쪽에서 10px
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '200px',
        zIndex: 1000,          // 겹침 우선순위 보장
      }}
    >
      <label htmlFor="image-upload" style={{ fontWeight: 'bold' }}>
        이미지 선택:
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {selectedFile && (
        <div style={{ fontSize: 12, color: '#555' }}>
          선택된 파일: {selectedFile.name}
        </div>
      )}

      {errorMessage && (
        <div style={{ color: 'red', fontSize: 12 }}>
          {errorMessage}
        </div>
      )}

      <button
        onClick={handleUploadClick}
        disabled={isUploading}
        style={{
          padding: '8px',
          cursor: isUploading ? 'not-allowed' : 'pointer',
        }}
      >
        {isUploading ? '업로드 중...' : '이미지 업로드'}
      </button>

      <button onClick={handleToggleLayer} style={{ padding: '8px' }}>
        {isLayerVisible ? '레이어 숨기기' : '레이어 보기'}
      </button>
    </div>
  );
};

export default OpenLayersImageControlBox;
