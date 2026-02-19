"use client";

import { useState, useEffect } from "react";
import RewriteForm from "@/components/RewriteForm";
import OutputPanel from "@/components/OutputPanel";
import FeedbackForm from "@/components/FeedbackForm";
import ConfirmModal from "@/components/ConfirmModal";
import { MetadataResponse, RewriteResponse } from "@/types";
import * as api from "@/lib/api";

export default function Home() {
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("");
  const [channel, setChannel] = useState("Teams");
  const [tone, setTone] = useState("Direct");
  const [roleMode, setRoleMode] = useState("General");
  const [template, setTemplate] = useState("Follow up");
  const [length, setLength] = useState("Normal");
  
  const [useContext, setUseContext] = useState(false);
  const [useChannel, setUseChannel] = useState(true);
  const [useTone, setUseTone] = useState(true);
  const [useRole, setUseRole] = useState(true);
  const [useTemplate, setUseTemplate] = useState(true);
  const [useLength, setUseLength] = useState(true);
  
  const [output, setOutput] = useState<RewriteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [previousRisk, setPreviousRisk] = useState<number | undefined>(undefined);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    api.getMetadata().then(setMetadata).catch(console.error);
  }, []);

  const handleRewrite = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setError(null);
    setShowBeforeAfter(false);
    setPreviousRisk(undefined);
    
    try {
      const result = await api.rewrite({
        text: message,
        context,
        channel,
        tone,
        role_mode: roleMode,
        template,
        length,
      });
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleMakeSafer = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setError(null);
    
    const currentRisk = output?.risk_score_output;
    
    try {
      const result = await api.rewriteSafer({
        text: message,
        context,
        channel,
        tone,
        role_mode: roleMode,
        template,
        length,
      });
      setOutput(result);
      setShowBeforeAfter(true);
      setPreviousRisk(currentRisk);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    
    if (output.risk_level_output === "High") {
      setShowConfirmModal(true);
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output.rewritten_text);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
      alert("Failed to copy");
    }
  };

  const handleCopyAnyway = () => {
    setShowConfirmModal(false);
    copyToClipboard();
  };

  const handleMakeSaferFromModal = () => {
    setShowConfirmModal(false);
    handleMakeSafer();
  };

  const handleFeedbackSubmit = async (rating: number, tags: string[], note: string) => {
    if (!output) return;
    
    setLoading(true);
    
    try {
      await api.submitFeedback({
        rewrite_request_id: output.rewrite_request_id,
        rating,
        tags,
        note,
        original_text: message,
        rewritten_text: output.rewritten_text,
        context,
        channel,
        tone,
        role_mode: roleMode,
        template,
        length,
      });
      alert("Feedback submitted!");
      setShowFeedback(false);
    } catch (err) {
      console.error("Feedback submission failed:", err);
      alert("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessage("");
    setContext("");
    setOutput(null);
    setError(null);
    setShowBeforeAfter(false);
    setPreviousRisk(undefined);
    setShowFeedback(false);
  };

  return (
    <main className="min-h-screen bg-[#0A1F2E] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="ProDraft AI Logo" 
              className="h-40 w-auto rounded-lg"
              style={{ mixBlendMode: 'lighten' }}
            />
          </div>
          <h1 className="text-5xl font-bold text-[#00D9FF] mb-3">
            ProDraft AI
          </h1>
          <p className="text-xl text-white font-medium mb-2">
            Clear. Professional. Compliant communication.
          </p>
          <p className="text-sm text-gray-300">
            Transform informal messages into polished, workplace-ready communication
          </p>
        </header>

        <div className="bg-[#0D2A3D] border-2 border-[#00D9FF] rounded-lg p-6 mb-6">
          <RewriteForm
            message={message}
            setMessage={setMessage}
            context={context}
            setContext={setContext}
            channel={channel}
            setChannel={setChannel}
            tone={tone}
            setTone={setTone}
            roleMode={roleMode}
            setRoleMode={setRoleMode}
            template={template}
            setTemplate={setTemplate}
            length={length}
            setLength={setLength}
            useContext={useContext}
            setUseContext={setUseContext}
            useChannel={useChannel}
            setUseChannel={setUseChannel}
            useTone={useTone}
            setUseTone={setUseTone}
            useRole={useRole}
            setUseRole={setUseRole}
            useTemplate={useTemplate}
            setUseTemplate={setUseTemplate}
            useLength={useLength}
            setUseLength={setUseLength}
            onRewrite={handleRewrite}
            onClear={handleClear}
            loading={loading}
            metadata={metadata}
          />
        </div>

        {error && (
          <div className="bg-[#0D2A3D] border-2 border-[#FF4444] text-white px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {output && (
          <>
            <div className="bg-[#0D2A3D] border-2 border-[#00D9FF] rounded-lg p-6 mb-6">
              <OutputPanel
                output={output}
                onMakeSafer={handleMakeSafer}
                onCopy={handleCopy}
                loading={loading}
                showBeforeAfter={showBeforeAfter}
                previousRisk={previousRisk}
              />
            </div>

            <div className="bg-[#0D2A3D] border-2 border-[#00D9FF] rounded-lg p-6">
              {!showFeedback ? (
                <button
                  onClick={() => setShowFeedback(true)}
                  className="w-full px-6 py-3 bg-[#0D2A3D] border-2 border-[#00D9FF] text-[#00D9FF] font-medium rounded-md hover:bg-[#163A4F] transition-colors flex items-center justify-center gap-2"
                >
                  <span className="text-lg">💬</span>
                  <span>Give Feedback</span>
                </button>
              ) : (
                <FeedbackForm
                  onSubmit={handleFeedbackSubmit}
                  loading={loading}
                  onClose={() => setShowFeedback(false)}
                />
              )}
            </div>
          </>
        )}

        <ConfirmModal
          isOpen={showConfirmModal}
          reasons={output?.risk_reasons_output || []}
          onCopyAnyway={handleCopyAnyway}
          onMakeSafer={handleMakeSaferFromModal}
          onClose={() => setShowConfirmModal(false)}
        />
      </div>
    </main>
  );
}
