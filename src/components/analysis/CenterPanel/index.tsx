import { useState } from 'react';
import './CenterPanel.scss';

const CenterPanel = () => {
  const [showTrendModal, setShowTrendModal] = useState(false);

  const handleTrendClick = () => {
    setShowTrendModal(true);
  };

  const handleCloseModal = () => {
    setShowTrendModal(false);
  };

  return (
    <div className="center-panel">
      <div className="panel-header">
        <h2 className="panel-title">情緒趨向</h2>
        <div className="trend-badge" onClick={handleTrendClick}>
          趨勢分析
        </div>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="關鍵主題情緒搜尋"
            className="search-input"
          />
          <div className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <img
          src="/radarchart.png"
          alt="情緒雷達圖"
          className="radar-chart"
        />
      </div>

      {/* 趨勢分析彈出視窗 */}
      {showTrendModal && (
        <div className="trend-modal-overlay" onClick={handleCloseModal}>
          <div className="trend-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <img
                src="/emotion.png"
                alt="近六個月情緒趨向分析圖表"
                className="trend-chart"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CenterPanel;
