export interface TranscriptionResponse {
  id: number;
  fileName: string;
  transcribedText: string;
  duration: number;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  transcriptionType: string;
  confidence?: number;
}

export interface ErrorResponse {
  message: string;
  error: string;
}