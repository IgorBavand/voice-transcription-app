import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranscriptionResponse, ErrorResponse } from '../models/Transcription';

@Injectable({
  providedIn: 'root'
})
export class TranscriptionService {
  private readonly API_URL = 'https://voice-transcription-production.up.railway.app/api/transcriptions';

  constructor(private http: HttpClient) {}

  transcribeAudio(file: File): Observable<TranscriptionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<TranscriptionResponse>(`${this.API_URL}/transcribe`, formData)
      .pipe(catchError(this.handleError));
  }

  liveTranscribe(audioData: Blob): Observable<TranscriptionResponse> {
    const formData = new FormData();
    formData.append('audio', audioData, 'live-audio.wav');

    return this.http.post<TranscriptionResponse>(`${this.API_URL}/live-transcribe`, formData)
      .pipe(catchError(this.handleError));
  }

  getAllTranscriptions(): Observable<TranscriptionResponse[]> {
    return this.http.get<TranscriptionResponse[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  getTranscriptionById(id: number): Observable<TranscriptionResponse> {
    return this.http.get<TranscriptionResponse>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  deleteTranscription(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  searchTranscriptions(query: string): Observable<TranscriptionResponse[]> {
    return this.http.get<TranscriptionResponse[]>(`${this.API_URL}/search`, {
      params: { query }
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      const errorResponse = error.error as ErrorResponse;
      errorMessage = errorResponse?.message || `Erro ${error.status}: ${error.message}`;
    }

    return throwError(() => errorMessage);
  }
}