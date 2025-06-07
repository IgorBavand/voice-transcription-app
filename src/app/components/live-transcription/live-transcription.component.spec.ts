import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTranscriptionComponent } from './live-transcription.component';

describe('LiveTranscriptionComponent', () => {
  let component: LiveTranscriptionComponent;
  let fixture: ComponentFixture<LiveTranscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveTranscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveTranscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
