import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private apiUrl = 'http://localhost:8787/audio';

  constructor(private http: HttpClient) {}

  async startRecording(sessionId: string) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);
    this.isRecording = true;

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
        this.sendChunk(event.data, sessionId);
      }
    };

    this.mediaRecorder.start(2000); // 2 segundos por churck
  }

  stopRecording(sessionId: string): Observable<any> {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }

    const formData = new FormData();
    formData.append('sessionId', sessionId);

    return this.http.post(`${this.apiUrl}/finish`, formData);
  }

  private sendChunk(blob: Blob, sessionId: string) {
    const formData = new FormData();
    formData.append('audio', blob, 'chunk.webm');
    formData.append('sessionId', sessionId);
    // Tenta enviar, se falhar salva no storage
    this.http.post(`${this.apiUrl}/stream`, formData).subscribe({
      error: () => this.saveChunkOffline(blob)
    });
  }

  private saveChunkOffline(blob: Blob) {
    // Simples: salva em localStorage (ideal: IndexedDB)
    const key = `audio_chunk_${Date.now()}`;
    blob.arrayBuffer().then(buffer => {
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      localStorage.setItem(key, base64);
    });
  }

  resendOfflineChunks(sessionId: string) {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('audio_chunk_')) {
        const base64 = localStorage.getItem(key)!;
        const binary = atob(base64);
        const array = new Uint8Array([...binary].map(char => char.charCodeAt(0)));
        const blob = new Blob([array], { type: 'audio/webm' });
        this.sendChunk(blob, sessionId);
        localStorage.removeItem(key);
      }
    });
  }
}
