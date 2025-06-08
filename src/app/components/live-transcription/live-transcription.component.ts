import { Component, OnDestroy } from '@angular/core';
import { AudioRecorderService } from '../../services/audio-recorder.service';
import {v4 as uuidv4} from 'uuid';

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

  sessionId: string = '';

  ngOnInit () {
    console.log('gerand o sessionId');
    this.sessionId = uuidv4();
  }

  constructor(private audioRecorderService: AudioRecorderService) {}

  async startRecording() {
    try {
      this.isRecording = true;
      this.errorMessage = '';
      this.transcriptionText = '';

      await this.audioRecorderService.startRecording(this.sessionId);
    } catch (error) {
      this.errorMessage = 'Erro ao acessar o microfone. Verifique as permissões.';
      this.isRecording = false;
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.isProcessing = true;
      this.audioRecorderService.stopRecording(this.sessionId).subscribe((res) => {
        this.isProcessing = false;
      });
    }
  }

  copyToClipboard() {
    if (this.transcriptionText) {
      navigator.clipboard.writeText(this.transcriptionText)
        .then(() => {
          console.log('Texto copiado com sucesso!');
        })
        .catch(err => {
          this.errorMessage = 'Erro ao copiar texto para a área de transferência';
          console.error('Erro ao copiar:', err);
        });
    }
  }

  downloadText() {
    if (!this.transcriptionText) return;

    const blob = new Blob([this.transcriptionText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcricao.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // downloadAudio() {
  //   // if (!this.audioBlob) return;

  //   const url = URL.createObjectURL(this.audioBlob);
  //   const a = document.createElement('a');
  //   const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  //   a.href = url;
  //   a.download = `gravacao-${timestamp}.webm`; // Changed to .webm as per service
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // }

  getWordCount(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  clearTranscription() {
    this.transcriptionText = '';
    this.errorMessage = '';
  }

  ngOnDestroy() {
    if (this.isRecording) {
      this.stopRecording();
    }
  }
}