import { Component } from '@angular/core';
import { TranscriptionService } from '../../services/transcription.service';
import { TranscriptionResponse } from '../../models/Transcription';

@Component({
  selector: 'app-transcription-upload',
  templateUrl: './transcription-upload.component.html',
  styleUrls: ['./transcription-upload.component.scss']
})
export class TranscriptionUploadComponent {
  selectedFile: File | null = null;
  isUploading = false;
  uploadResult: TranscriptionResponse | null = null;
  errorMessage = '';

  constructor(private transcriptionService: TranscriptionService) {}

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
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}