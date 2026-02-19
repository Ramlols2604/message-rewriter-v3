"use client";

interface RiskPanelProps {
  score: number;
  level: string;
  reasons: string[];
  title?: string;
}

export default function RiskPanel({ score, level, reasons, title = "Risk Assessment" }: RiskPanelProps) {
  const getColorClasses = () => {
    return "bg-[#0D2A3D] text-white border-[#00D9FF]";
  };

  const getGaugeColor = () => {
    if (score < 30) return "bg-[#00D9FF]";
    if (score < 60) return "bg-[#FFA500]";
    return "bg-[#FF4444]";
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getColorClasses()}`}>
      <h3 className="font-semibold text-[#00D9FF] mb-3">{title}</h3>
      
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-white">Risk Score</span>
          <span className="font-bold text-white">{score}/100</span>
        </div>
        <div className="w-full bg-[#163A4F] rounded-full h-2 border border-[#00D9FF]">
          <div
            className={`h-2 rounded-full ${getGaugeColor()}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="mb-3">
        <span className={`inline-block px-3 py-1 border-2 rounded-full text-sm font-semibold ${
          level === "Low" ? "bg-[#00D9FF] text-[#0A1F2E] border-[#00D9FF]" :
          level === "Medium" ? "bg-[#FFA500] text-[#0A1F2E] border-[#FFA500]" :
          "bg-[#FF4444] text-white border-[#FF4444]"
        }`}>
          {level} Risk
        </span>
      </div>

      {reasons.length > 0 && (
        <div>
          <p className="text-sm font-medium text-white mb-2">Reasons:</p>
          <ul className="space-y-1">
            {reasons.map((reason, idx) => (
              <li key={idx} className="text-sm text-white flex items-start">
                <span className="mr-2">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
