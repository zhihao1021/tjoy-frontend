import { useState, type Dispatch, type SetStateAction } from 'react';
import './RightPanel.scss';

const RightPanel = ({
  timePeriod, setTimePeriod
}: {
  timePeriod: string,
  setTimePeriod: Dispatch<SetStateAction<string>>
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const timeOptions = ['前一個月', '前三個月'];

  // CSV 數據
  const allEventData = [
    { title: "人工智慧數據學習應用", keywords: "學習、應用、數據", proportion: 55, month: 3, rank: 2 },
    { title: "人才培育教育發展", keywords: "人才、培育、教育", proportion: 6, month: 1, rank: 9 },
    { title: "人才教育職涯發展", keywords: "人才、教育、職涯", proportion: 32, month: 3, rank: 6 },
    { title: "供應鏈全球合作風險", keywords: "供應鏈、全球、風險", proportion: 7, month: 1, rank: 8 },
    { title: "供應鏈風險韌性合作", keywords: "供應鏈、風險、合作", proportion: 45, month: 3, rank: 4 },
    { title: "健康醫療數位照護", keywords: "健康、醫療、數位", proportion: 23, month: 3, rank: 8 },
    { title: "公司影響海外技術", keywords: "海外、技術、供應", proportion: 14, month: 1, rank: 2 },
    { title: "公司成本很多設備", keywords: "成本、設備、壓力", proportion: 40, month: 1, rank: 1 },
    { title: "公司治理策略決策", keywords: "治理、策略、組織", proportion: 70, month: 3, rank: 1 },
    { title: "國際政策貿易談判", keywords: "國際、政策、貿易", proportion: 18, month: 3, rank: 9 },
    { title: "市場品牌消費者需求", keywords: "市場、消費者、需求", proportion: 39, month: 3, rank: 5 },
    { title: "市場需求成長挑戰", keywords: "市場、需求、競爭", proportion: 9, month: 1, rank: 5 },
    { title: "技術製程未來", keywords: "技術、封裝、未來", proportion: 11, month: 1, rank: 4 },
    { title: "排放製社會程", keywords: "排放、社會、減碳", proportion: 12, month: 1, rank: 3 },
    { title: "氣候永續能源轉型", keywords: "氣候、永續、能源", proportion: 50, month: 3, rank: 3 },
    { title: "產品創新設計體驗", keywords: "產品、創新、設計", proportion: 6, month: 3, rank: 10 },
    { title: "研發創新技術突破", keywords: "研發、技術、突破", proportion: 7, month: 1, rank: 7 },
    { title: "能源永續環境政策", keywords: "能源、永續、政策", proportion: 8, month: 1, rank: 6 },
    { title: "金融成本投資壓力", keywords: "金融、成本、投資", proportion: 6, month: 1, rank: 10 },
    { title: "金融資金投資市場", keywords: "金融、資金、投資", proportion: 28, month: 3, rank: 7 }
  ];

  // 根據時間區段篩選數據 (month: 1 = 前一個月, month: 3 = 前三個月)
  const getFilteredData = () => {
    const targetMonth = timePeriod === '前一個月' ? 1 : 3;
    return allEventData
      .filter(event => event.month === targetMonth)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 10); // 顯示前10名
  };

  const eventData = getFilteredData();

  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
    setIsDropdownOpen(false);
  };

  const getCircleProgress = (percentage: number) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return {
      radius,
      circumference,
      strokeDasharray,
      strokeDashoffset
    };
  };

  return (
    <div className="right-panel">
      <div className="panel-header">
        <h2 className="panel-title">事件關鍵詞比例</h2>
        <div className="time-dropdown">
          <button
            className="time-dropdown-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {timePeriod}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}
            >
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              {timeOptions.map((option) => (
                <button
                  key={option}
                  className={`dropdown-item ${timePeriod === option ? 'active' : ''}`}
                  onClick={() => handleTimePeriodChange(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="event-list">
        {eventData.map((event) => {
          const progress = getCircleProgress(event.proportion);

          return (
            <div key={`${event.month}-${event.rank}`} className="event-card">
              <div className="event-header">
                <span className="event-rank">排名{event.rank}</span>
              </div>

              <div className="event-content">
                <div className="event-info">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-keywords">
                    <span className="keywords-label">關鍵字：</span>
                    <span className="keywords-text">{event.keywords}</span>
                  </div>
                </div>

                <div className="event-chart">
                  <div className="circular-progress">
                    <svg width="100" height="100" className="progress-svg">
                      <circle
                        cx="50"
                        cy="50"
                        r={progress.radius}
                        fill="none"
                        stroke="#e9ecef"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r={progress.radius}
                        fill="none"
                        stroke="#20b2aa"
                        strokeWidth="8"
                        strokeDasharray={progress.strokeDasharray}
                        strokeDashoffset={progress.strokeDashoffset}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="progress-text">
                      <span className="progress-count">篇數佔比 {event.proportion}篇</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RightPanel;
