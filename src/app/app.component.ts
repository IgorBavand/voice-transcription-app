import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Voice Transcribe';
  activeTab: string = 'live'; // Começar com a aba de gravação

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
