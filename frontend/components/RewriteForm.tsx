"use client";

import { MetadataResponse } from "@/types";

interface RewriteFormProps {
  message: string;
  setMessage: (value: string) => void;
  context: string;
  setContext: (value: string) => void;
  channel: string;
  setChannel: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  roleMode: string;
  setRoleMode: (value: string) => void;
  template: string;
  setTemplate: (value: string) => void;
  length: string;
  setLength: (value: string) => void;
  useContext: boolean;
  setUseContext: (value: boolean) => void;
  useChannel: boolean;
  setUseChannel: (value: boolean) => void;
  useTone: boolean;
  setUseTone: (value: boolean) => void;
  useRole: boolean;
  setUseRole: (value: boolean) => void;
  useTemplate: boolean;
  setUseTemplate: (value: boolean) => void;
  useLength: boolean;
  setUseLength: (value: boolean) => void;
  onRewrite: () => void;
  onClear: () => void;
  loading: boolean;
  metadata: MetadataResponse | null;
}

export default function RewriteForm({
  message,
  setMessage,
  context,
  setContext,
  channel,
  setChannel,
  tone,
  setTone,
  roleMode,
  setRoleMode,
  template,
  setTemplate,
  length,
  setLength,
  useContext,
  setUseContext,
  useChannel,
  setUseChannel,
  useTone,
  setUseTone,
  useRole,
  setUseRole,
  useTemplate,
  setUseTemplate,
  useLength,
  setUseLength,
  onRewrite,
  onClear,
  loading,
  metadata,
}: RewriteFormProps) {
  const messageCharsLeft = 1500 - message.length;
  const contextCharsLeft = 280 - context.length;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#00D9FF] mb-1">
          Message *
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1500}
          rows={6}
          placeholder="Type your casual message here..."
          className="w-full px-3 py-2 border-2 border-[#00D9FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D9FF] bg-[#0A1F2E] text-white placeholder:text-gray-400"
        />
        <div className="text-xs text-gray-300 mt-1">
          {messageCharsLeft} characters remaining
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            id="useContext"
            checked={useContext}
            onChange={(e) => setUseContext(e.target.checked)}
            className="w-4 h-4 border-2 border-[#00D9FF] rounded accent-[#00D9FF]"
          />
          <label htmlFor="useContext" className="text-sm font-medium text-[#00D9FF]">
            Context (optional)
          </label>
        </div>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          maxLength={280}
          rows={2}
          placeholder='Example: "Sending to my manager about a late report"'
          disabled={!useContext}
          className={`w-full px-3 py-2 border-2 border-[#00D9FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D9FF] bg-[#0A1F2E] text-white placeholder:text-gray-400 ${
            !useContext ? "opacity-30 cursor-not-allowed" : ""
          }`}
        />
        <div className={`text-xs text-gray-300 mt-1 ${!useContext ? "opacity-30" : ""}`}>
          {contextCharsLeft} characters remaining
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              id="useChannel"
              checked={useChannel}
              onChange={(e) => setUseChannel(e.target.checked)}
              className="w-4 h-4 border-2 border-[#00D9FF] rounded accent-[#00D9FF]"
            />
            <label htmlFor="useChannel" className="text-sm font-medium text-[#00D9FF]">
              Channel
            </label>
          </div>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            disabled={!useChannel}
            className={`w-full px-3 py-2 border-2 border-[#00D9FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D9FF] bg-[#0A1F2E] text-white ${
              !useChannel ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            {metadata?.channels.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              id="useTone"
              checked={useTone}
              onChange={(e) => setUseTone(e.target.checked)}
              className="w-4 h-4 border-2 border-[#00D9FF] rounded accent-[#00D9FF]"
            />
            <label htmlFor="useTone" className="text-sm font-medium text-[#00D9FF]">
              Tone
            </label>
          </div>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={!useTone}
            className={`w-full px-3 py-2 border-2 border-[#00D9FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D9FF] bg-[#0A1F2E] text-white ${
              !useTone ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            {metadata?.tones.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              id="useRole"
              checked={useRole}
              onChange={(e) => setUseRole(e.target.checked)}
              className="w-4 h-4 border-2 border-[#00D9FF] rounded accent-[#00D9FF]"
            />
            <label htmlFor="useRole" className="text-sm font-medium text-[#00D9FF]">
              Role
            </label>
          </div>
          <select
            value={roleMode}
            onChange={(e) => setRoleMode(e.target.value)}
            disabled={!useRole}
            className={`w-full px-3 py-2 border-2 border-[#00D9FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D9FF] bg-[#0A1F2E] text-white ${
              !useRole ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            {metadata?.role_modes.map((rm) => (
              <option key={rm} value={rm}>
                {rm}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              id="useTemplate"
              checked={useTemplate}
              onChange={(e) => setUseTemplate(e.target.checked)}
              className="w-4 h-4 border-2 border-[#00D9FF] rounded accent-[#00D9FF]"
            />
            <label htmlFor="useTemplate" className="text-sm font-medium text-[#00D9FF]">
              Template
            </label>
          </div>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            disabled={!useTemplate}
            className={`w-full px-3 py-2 border-2 border-[#00D9FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D9FF] bg-[#0A1F2E] text-white ${
              !useTemplate ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            {metadata?.templates.map((tmpl) => (
              <option key={tmpl} value={tmpl}>
                {tmpl}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              id="useLength"
              checked={useLength}
              onChange={(e) => setUseLength(e.target.checked)}
              className="w-4 h-4 border-2 border-[#00D9FF] rounded accent-[#00D9FF]"
            />
            <label htmlFor="useLength" className="text-sm font-medium text-[#00D9FF]">
              Length
            </label>
          </div>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value)}
            disabled={!useLength}
            className={`w-full px-3 py-2 border-2 border-[#00D9FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D9FF] bg-[#0A1F2E] text-white ${
              !useLength ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            {metadata?.lengths.map((len) => (
              <option key={len} value={len}>
                {len}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onRewrite}
          disabled={!message.trim() || loading}
          className="flex-1 px-6 py-3 bg-[#00D9FF] border-2 border-[#00D9FF] text-[#0A1F2E] font-bold rounded-md hover:bg-[#00B8D9] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-lg"
        >
          {loading ? "Rewriting..." : "Rewrite"}
        </button>
        <button
          onClick={onClear}
          disabled={loading}
          className="px-6 py-3 bg-[#0D2A3D] border-2 border-[#00D9FF] text-[#00D9FF] font-medium rounded-md hover:bg-[#163A4F] disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
