import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import './ChartNav.css';

const ChartNav = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate(); // ✅ React Router hook

  const menuItems = [
    { id: 1, label: '오픈레이어 전체', path: '/open-full' },
    { id: 2, label: '오픈레이어 일부분', path: '/open-partial' },
    { id: 3, label: '세슘JS 기본', path: '/cesium-full' },
    { id: 4, label: '세슘JS 마커', path: '/cesium-marker' },
    { id: 5, label: '세슘JS 벤처벨리', path: '/cesium-road' },
    { id: 6, label: '세슘JS 강변북로', path: '/cesium-road2' },
    { id: 7, label: '세슘JS 강변북로(실시간)', path: '/cesium-road3' },
  ];

  const handleClick = (item) => {
    setCurrentPage(item.id);
    navigate(item.path); // ✅ 경로 이동
  };

  return (
    <nav className="chart-nav">
      <div className="chart-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`chart-menu-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => handleClick(item)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="chart-author">작성자: Brad / 박호범</div>
    </nav>
  );
};

export default ChartNav;
