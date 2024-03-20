import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchActivityPageComponent } from './search-activity-page.component';

describe('SearchActivityPageComponent', () => {
  let component: SearchActivityPageComponent;
  let fixture: ComponentFixture<SearchActivityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchActivityPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchActivityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
