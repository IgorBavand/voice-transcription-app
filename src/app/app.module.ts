import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { TranscriptionUploadComponent } from './components/transcription-upload/transcription-upload.component';
import { TranscriptionListComponent } from './components/transcription-list/transcription-list.component';
import { LiveTranscriptionComponent } from './components/live-transcription/live-transcription.component';
import { TranscriptionSearchComponent } from './components/transcription-search/transcription-search.component';
import {
  LucideAngularModule, Mic, Upload, List, Search, Square, FileText, Trash2, Copy, Download, AlertCircle, X, RefreshCw, Clock,
  Eye, // Adicionar Eye
  EyeOff // Adicionar EyeOff
} from 'lucide-angular';

@NgModule({
  declarations: [
    AppComponent,
    TranscriptionUploadComponent,
    TranscriptionListComponent,
    LiveTranscriptionComponent,
    TranscriptionSearchComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    LucideAngularModule.pick({
      Mic, Upload, List, Search, Square, FileText, Trash2, Copy, Download, AlertCircle, X, RefreshCw, Clock,
      Eye, // Adicionar Eye
      EyeOff // Adicionar EyeOff
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
