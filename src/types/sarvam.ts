export interface SarvamChatCompletionRequest {
  model: 'sarvam-105b-conversations';
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export interface SarvamChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
}

export interface SarvamTTSRequest {
  text: string;
  language_code: string;
  model?: 'bulbul:v3' | 'bulbul:v4-flash';
  speaker?: 'shubh' | 'priya' | 'aditya' | string;
}

export interface SarvamTTSResponse {
  audios: string[]; // base64 encoded audio strings
}

export interface SarvamASRRequest {
  model?: 'saaras:v3' | 'saaras:v4';
  language_code?: string;
  mode?: 'transcribe' | 'translate';
}

export interface SarvamASRResponse {
  transcript: string;
  language_code?: string;
}

export interface SarvamTranslateRequest {
  input: string;
  source_language_code: string;
  target_language_code: string;
  speaker_gender?: 'Male' | 'Female';
  mode?: 'formal' | 'code-mixed';
  model?: 'mayura:v1';
}

export interface SarvamTranslateResponse {
  translated_text: string;
}

export interface ContradictionAssessment {
  contradictionScore: number;
  statedAmount: number;
  sanctionedAmount: number;
  isContradiction: boolean;
  summary: string;
  grievanceCategory: string;
}
