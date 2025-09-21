import { useState, type ReactNode } from "react";

import LeftPanel from '@/components/analysis/LeftPanel';
import CenterPanel from '@/components/analysis/CenterPanel';
import RightPanel from '@/components/analysis/RightPanel';

import "./index.scss";

export default function AnalysisPage(): ReactNode {
    const [timePeriod, setTimePeriod] = useState('前一個月');

    return <div className="dashboard-content">
        <LeftPanel />
        <CenterPanel />
        <RightPanel
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
        />
    </div>
}