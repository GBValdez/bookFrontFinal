import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookHomeComponent } from './book-home.component';

describe('BookHomeComponent', () => {
  let component: BookHomeComponent;
  let fixture: ComponentFixture<BookHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
