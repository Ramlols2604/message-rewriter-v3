import { RewriteRequest, RewriteResponse, FeedbackRequest, MetadataResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getMetadata(): Promise<MetadataResponse> {
  const res = await fetch(`${API_BASE_URL}/metadata`);
  if (!res.ok) {
    throw new Error(`Failed to fetch metadata: ${res.statusText}`);
  }
  return res.json();
}

export async function rewrite(payload: RewriteRequest): Promise<RewriteResponse> {
  const res = await fetch(`${API_BASE_URL}/rewrite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorData.message || "Rewrite failed. Try again.");
  }
  
  return res.json();
}

export async function rewriteSafer(payload: RewriteRequest): Promise<RewriteResponse> {
  const res = await fetch(`${API_BASE_URL}/rewrite/safer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorData.message || "Rewrite failed. Try again.");
  }
  
  return res.json();
}

export async function submitFeedback(payload: FeedbackRequest): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to submit feedback: ${res.statusText}`);
  }
}
