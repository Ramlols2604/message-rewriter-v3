"use client";

import { useState } from "react";

interface FeedbackFormProps {
  onSubmit: (rating: number, tags: string[], note: string) => void;
  loading: boolean;
  onClose?: () => void;
}

const FEEDBACK_TAGS = [
  "Changed meaning",
  "Too formal",
  "Too long",
  "Still slang",
  "Risky",
  "Good",
];

export default function FeedbackForm({ onSubmit, loading, onClose }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    onSubmit(rating, selectedTags, note);
    setRating(0);
    setHoveredRating(0);
    setSelectedTags([]);
    setNote("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-[#00D9FF]">Feedback</h4>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
            title="Close feedback"
          >
            ×
          </button>
        )}
      </div>

      <div className="mb-3">
        <p className="text-sm text-white mb-2">Rate this rewrite:</p>
        <div 
          className="flex gap-2"
          onMouseLeave={() => setHoveredRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = hoveredRating > 0 ? hoveredRating >= star : rating >= star;
            return (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                className={`w-10 h-10 rounded border-2 ${
                  isActive
                    ? "bg-[#00D9FF] text-[#0A1F2E] border-[#00D9FF]"
                    : "bg-[#0D2A3D] text-white border-[#00D9FF]"
                } transition-colors`}
              >
                ★
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm text-white mb-2">Tags (optional):</p>
        <div className="flex flex-wrap gap-2">
          {FEEDBACK_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium border-2 border-[#00D9FF] transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-[#00D9FF] text-[#0A1F2E]"
                  : "bg-[#0D2A3D] text-white hover:bg-[#163A4F]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm text-white mb-1">
          Note (optional):
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={300}
          rows={3}
          placeholder="Additional feedback..."
          className="w-full px-3 py-2 border-2 border-[#00D9FF] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#00D9FF] bg-[#0A1F2E] text-white placeholder:text-gray-400"
        />
        <div className="text-xs text-gray-300 mt-1">
          {300 - note.length} characters remaining
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={rating === 0 || loading}
          className="w-full px-4 py-2 bg-[#00D9FF] border-2 border-[#00D9FF] text-[#0A1F2E] font-bold rounded-md hover:bg-[#00B8D9] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  );
}
