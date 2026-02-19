"use client";

import { RewriteResponse, Stats } from "@/types";
import RiskPanel from "./RiskPanel";

interface OutputPanelProps {
  output: RewriteResponse;
  onMakeSafer: () => void;
  onCopy: () => void;
  loading: boolean;
  showBeforeAfter?: boolean;
  previousRisk?: number;
}

export default function OutputPanel({
  output,
  onMakeSafer,
  onCopy,
  loading,
  showBeforeAfter = false,
  previousRisk,
}: OutputPanelProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output.rewritten_text);
    onCopy();
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-[#00D9FF] mb-2">Rewritten Text</h3>
        <div className="p-4 bg-[#0D2A3D] border-2 border-[#00D9FF] rounded-md whitespace-pre-wrap text-white">
          {output.rewritten_text}
        </div>
      </div>

      {output.clarifying_question && (
        <div className="p-3 bg-[#0D2A3D] border-2 border-[#00D9FF] rounded-md">
          <p className="text-sm font-medium text-[#00D9FF]">
            Clarifying Question:
          </p>
          <p className="text-sm text-white mt-1">
            {output.clarifying_question}
          </p>
          <p className="text-xs text-gray-300 mt-2">
            Please add this information to the Context field and click Rewrite again.
          </p>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-[#00D9FF] mb-2">What Changed</h4>
        <ul className="space-y-1">
          {output.what_changed.map((change, idx) => (
            <li key={idx} className="text-sm text-white flex items-start">
              <span className="mr-2">•</span>
              <span>{change}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-white">Confidence:</span>
        <span
          className={`px-2 py-1 border-2 border-[#00D9FF] rounded text-xs font-semibold ${
            output.confidence === "high"
              ? "bg-[#00D9FF] text-[#0A1F2E]"
              : "bg-[#0D2A3D] text-gray-300"
          }`}
        >
          {output.confidence.toUpperCase()}
        </span>
      </div>

      {showBeforeAfter && previousRisk !== undefined && (
        <div className="p-3 bg-[#0D2A3D] border-2 border-[#00D9FF] rounded-md">
          <h4 className="text-sm font-semibold text-[#00D9FF] mb-2">
            Before vs After
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white">Risk Score Change:</p>
              <p className="font-semibold text-white">
                {previousRisk} → {output.risk_score_output}
                {output.risk_score_output < previousRisk && (
                  <span className="text-[#00D9FF] ml-2">
                    ↓ {previousRisk - output.risk_score_output}
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-white">Character Count Change:</p>
              <p className="font-semibold text-white">
                {output.stats_before.character_count} →{" "}
                {output.stats_after.character_count}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-[#0D2A3D] border-2 border-[#00D9FF] rounded-lg">
            <h4 className="text-sm font-semibold text-[#00D9FF] mb-2">Input Risk</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white">Score:</span>
                <span className="font-bold text-white">
                  {output.risk_score_input}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Level:</span>
                <span className="font-semibold text-white">
                  {output.risk_level_input}
                </span>
              </div>
              {output.risk_reasons_input.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-white font-medium mb-1">Flags:</p>
                  <ul className="space-y-1">
                    {output.risk_reasons_input.map((reason, idx) => (
                      <li key={idx} className="text-xs text-white">
                        • {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <RiskPanel
            score={output.risk_score_output}
            level={output.risk_level_output}
            reasons={output.risk_reasons_output}
            title="Output Risk"
          />
        </div>
        
        <div className="p-4 bg-[#0D2A3D] border-2 border-[#00D9FF] rounded-lg">
          <h4 className="text-sm font-semibold text-[#00D9FF] mb-2">Statistics</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-white">Characters:</span>
              <span className="font-medium text-white">
                {output.stats_after.character_count}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Sentences:</span>
              <span className="font-medium text-white">
                {output.stats_after.sentence_count}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Bullets:</span>
              <span className="font-medium text-white">
                {output.stats_after.bullet_count}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onMakeSafer}
          disabled={loading}
          className="flex-1 px-6 py-2 bg-[#0D2A3D] border-2 border-[#00D9FF] text-[#00D9FF] font-medium rounded-md hover:bg-[#163A4F] disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Processing..." : "Make Safer"}
        </button>
        <button
          onClick={copyToClipboard}
          disabled={loading}
          className="flex-1 px-6 py-2 bg-[#00D9FF] border-2 border-[#00D9FF] text-[#0A1F2E] font-bold rounded-md hover:bg-[#00B8D9] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          Copy
        </button>
      </div>
    </div>
  );
}
