import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionUploadComponent } from './transcription-upload.component';

describe('TranscriptionUploadComponent', () => {
  let component: TranscriptionUploadComponent;
  let fixture: ComponentFixture<TranscriptionUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranscriptionUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranscriptionUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
