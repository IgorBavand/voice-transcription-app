import { Component, OnDestroy } from '@angular/core';
import { TranscriptionService } from '../../services/transcription.service';

@Component({
  selector: 'app-live-transcription',
  templateUrl: './live-transcription.component.html',
  styleUrls: ['./live-transcription.component.scss']
})
export class LiveTranscriptionComponent implements OnDestroy {
  isRecording = false;
  isProcessing = false;
  transcriptionText = '';
  errorMessage = '';

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor(private transcriptionService: TranscriptionService) { }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.errorMessage = '';
      this.transcriptionText = ''; // Clear previous transcription

      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      });

      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.sendAudioForTranscription(audioBlob);
      });

      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      this.errorMessage = 'Erro ao acessar o microfone. Verifique as permissões.';
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.isRecording = false;
      this.isProcessing = true;
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  private sendAudioForTranscription(audioBlob: Blob) {
    this.transcriptionService.liveTranscribe(audioBlob).subscribe({
      next: (result) => {
        this.transcriptionText = result.transcribedText;
        this.isProcessing = false;
        this.audioChunks = []; // Clear chunks after successful transcription
      },
      error: (error) => {
        this.errorMessage = error;
        this.isProcessing = false;
        this.audioChunks = []; // Clear chunks on error
      }
    });
  }

  clearTranscription() {
    this.transcriptionText = '';
    this.errorMessage = '';
  }

  copyToClipboard() {
    if (this.transcriptionText) {
      navigator.clipboard.writeText(this.transcriptionText);
    }
  }

  downloadText() {
    if (this.transcriptionText) {
      const blob = new Blob([this.transcriptionText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'live-transcription.txt';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  getWordCount(text: string): number {
    return text ? text.trim().split(/\s+/).length : 0;
  }

  ngOnDestroy() {
    if (this.isRecording) {
      this.stopRecording();
    }
  }
}
