import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { TranscriptionService } from '../../services/transcription.service';
import { TranscriptionResponse } from '../../models/Transcription';

@Component({
  selector: 'app-transcription-list',
  templateUrl: './transcription-list.component.html',
  styleUrls: ['./transcription-list.component.scss'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class TranscriptionListComponent implements OnInit {
  transcriptions: TranscriptionResponse[] = [];
  isLoading = false;
  errorMessage = '';
  visibleTranscriptionIds: Set<number> = new Set();

  constructor(private transcriptionService: TranscriptionService) { }

  ngOnInit() {
    this.loadTranscriptions();
  }

  loadTranscriptions() {
    this.isLoading = true;
    this.errorMessage = '';

    this.transcriptionService.getAllTranscriptions().subscribe({
      next: (transcriptions) => {
        this.transcriptions = transcriptions;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.isLoading = false;
      }
    });
  }

  deleteTranscription(id: number) {
    if (confirm('Tem certeza que deseja deletar esta transcrição?')) {
      this.transcriptionService.deleteTranscription(id).subscribe({
        next: () => {
          this.transcriptions = this.transcriptions.filter(t => t.id !== id);
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
    }
  }

  toggleTranscriptionText(id: number) {
    const newSet = new Set(this.visibleTranscriptionIds);
    console.log(id)
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    this.visibleTranscriptionIds = newSet; // Atribui a nova instância
  }

  isTextVisible(id: number): boolean {
    return this.visibleTranscriptionIds.has(id);
  }

  copyTranscriptionText(text: string) {
    navigator.clipboard.writeText(text).then(
      () => alert('Texto copiado para a área de transferência!'),
      () => alert('Erro ao copiar texto')
    );
  }

  getConfidenceClass(confidence: number): string {
    if (confidence >= 0.9) return 'high-confidence';
    if (confidence >= 0.7) return 'medium-confidence';
    return 'low-confidence';
  }

  trackByTranscriptionId(index: number, transcription: TranscriptionResponse): number {
    return transcription.id;
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
