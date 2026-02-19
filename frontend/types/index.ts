export interface Stats {
  character_count: number;
  sentence_count: number;
  bullet_count: number;
}

export interface RewriteRequest {
  text: string;
  context?: string;
  channel: string;
  tone: string;
  role_mode: string;
  template: string;
  length: string;
}

export interface RewriteResponse {
  rewrite_request_id: string;
  rewritten_text: string;
  what_changed: string[];
  clarifying_question: string;
  confidence: "high" | "low";
  risk_score_input: number;
  risk_level_input: string;
  risk_reasons_input: string[];
  risk_score_output: number;
  risk_level_output: string;
  risk_reasons_output: string[];
  detected_flags_input: string[];
  detected_flags_output: string[];
  stats_before: Stats;
  stats_after: Stats;
}

export interface FeedbackRequest {
  rewrite_request_id: string;
  rating: number;
  tags: string[];
  note?: string;
  original_text?: string;
  rewritten_text?: string;
  context?: string;
  channel?: string;
  tone?: string;
  role_mode?: string;
  template?: string;
  length?: string;
}

export interface MetadataResponse {
  channels: string[];
  tones: string[];
  role_modes: string[];
  templates: string[];
  lengths: string[];
}
