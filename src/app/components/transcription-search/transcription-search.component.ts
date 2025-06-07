import { Component } from '@angular/core';
import { TranscriptionService } from '../../services/transcription.service';
import { TranscriptionResponse } from '../../models/Transcription';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-transcription-search',
  templateUrl: './transcription-search.component.html',
  styleUrls: ['./transcription-search.component.scss']
})
export class TranscriptionSearchComponent {
  searchQuery = '';
  searchResults: TranscriptionResponse[] = [];
  isSearching = false;
  errorMessage = '';

  private searchSubject = new Subject<string>();

  constructor(private transcriptionService: TranscriptionService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.trim()) {
        this.performSearch(query);
      } else {
        this.searchResults = [];
      }
    });
  }

  onSearchInput(query: string) {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  private performSearch(query: string) {
    this.isSearching = true;
    this.errorMessage = '';

    this.transcriptionService.searchTranscriptions(query).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.isSearching = false;
      }
    });
  }
}