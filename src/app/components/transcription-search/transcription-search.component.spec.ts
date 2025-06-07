import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionSearchComponent } from './transcription-search.component';

describe('TranscriptionSearchComponent', () => {
  let component: TranscriptionSearchComponent;
  let fixture: ComponentFixture<TranscriptionSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranscriptionSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranscriptionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
