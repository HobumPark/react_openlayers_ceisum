import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import './ChartNav.css';

const ChartNav = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate(); // ✅ React Router hook

  const menuItems = [
    { id: 1, label: '오픈레이어 전체', path: '/open-full' },
    { id: 2, label: '오픈레이어 일부분', path: '/open-partial' },
    { id: 3, label: '세슘JS 전체', path: '/cesium-full' },
    { id: 4, label: '세슘JS 일부분', path: '/cesium-partial' },
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
