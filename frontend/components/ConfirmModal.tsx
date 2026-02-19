"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  reasons: string[];
  onCopyAnyway: () => void;
  onMakeSafer: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  reasons,
  onCopyAnyway,
  onMakeSafer,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#0A1F2E] border-4 border-[#FF4444] rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-[#FF4444] mb-3">
          🚨 High Risk Detected
        </h3>
        
        <p className="text-sm text-white mb-4">
          This text may be risky because:
        </p>
        
        <ul className="space-y-2 mb-6">
          {reasons.map((reason, idx) => (
            <li
              key={idx}
              className="text-sm text-white bg-[#0D2A3D] px-3 py-2 rounded border-2 border-[#00D9FF]"
            >
              • {reason}
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          <button
            onClick={onMakeSafer}
            className="flex-1 px-4 py-2 bg-[#00D9FF] border-2 border-[#00D9FF] text-[#0A1F2E] font-bold rounded-md hover:bg-[#00B8D9] transition-colors"
          >
            Make Safer
          </button>
          <button
            onClick={onCopyAnyway}
            className="flex-1 px-4 py-2 bg-[#FF4444] border-2 border-[#FF4444] text-white font-medium rounded-md hover:bg-[#DD2222] transition-colors"
          >
            Copy Anyway
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 px-4 py-2 text-white hover:text-gray-300 text-sm border-2 border-[#00D9FF] rounded-md hover:bg-[#163A4F]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
