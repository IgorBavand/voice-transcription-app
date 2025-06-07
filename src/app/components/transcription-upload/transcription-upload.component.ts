import { Component } from '@angular/core';
import { TranscriptionService } from '../../services/transcription.service';
import { TranscriptionResponse } from '../../models/Transcription';

@Component({
  selector: 'app-transcription-upload',
  templateUrl: './transcription-upload.component.html',
  styleUrls: ['./transcription-upload.component.scss']
})
export class TranscriptionUploadComponent {
  activeTab: 'record' | 'upload' = 'upload';
  selectedFile: File | null = null;
  isUploading = false;
  isRecording = false;
  recordingDuration = 0;
  isDragOver = false;
  errorMessage = '';
  uploadResult: TranscriptionResponse | null = null;

  constructor(private transcriptionService: TranscriptionService) { }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file && this.isAudioFile(file)) {
      this.selectedFile = file;
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Por favor, selecione um arquivo de áudio válido (.wav, .mp3, .flac, .ogg)';
      this.selectedFile = null;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.errorMessage = '';
    }
  }

  removeFile() {
    this.selectedFile = null;
  }

  toggleRecording() {
    this.isRecording = !this.isRecording;
    // Implementar lógica de gravação
  }

  onUpload() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.errorMessage = '';
    this.uploadResult = null;

    this.transcriptionService.transcribeAudio(this.selectedFile).subscribe({
      next: (result) => {
        this.uploadResult = result;
        this.isUploading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.isUploading = false;
      }
    });
  }

  copyToClipboard() {
    if (this.uploadResult?.transcribedText) {
      navigator.clipboard.writeText(this.uploadResult.transcribedText);
    }
  }

  downloadText() {
    if (this.uploadResult?.transcribedText) {
      const blob = new Blob([this.uploadResult.transcribedText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transcription.txt';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  private isAudioFile(file: File): boolean {
    return file.type.startsWith('audio/');
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getWordCount(text: string): number {
    return text ? text.trim().split(/\s+/).length : 0;
  }
}
