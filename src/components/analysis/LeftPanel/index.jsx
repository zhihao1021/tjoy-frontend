import React from 'react';
import './LeftPanel.scss';

const LeftPanel = () => {
  const handleOneClickOutput = () => {
    console.log('一鍵輸出功能觸發');
    // 這裡可以添加實際的一鍵輸出邏輯
  };

  return (
    <div className="left-panel">
      <div className="stats-card post-count">
        <div className="stats-label">發文數量</div>
        <div className="stats-value">150則</div>
      </div>

      <div className="stats-card activity-count">
        <div className="stats-label">活動數量</div>
        <div className="stats-value">180個</div>
      </div>

      <a
        className="one-click-output-btn"
        onClick={handleOneClickOutput}
        href="data:application/octet-stream;base64,SGVsbG8="
        download="output.json"
      >
        一鍵輸出
      </a>
    </div>
  );
};

export default LeftPanel;
