jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FavouritesListService } from '../service/favourites-list.service';

import { FavouritesListDeleteDialogComponent } from './favourites-list-delete-dialog.component';

describe('FavouritesList Management Delete Component', () => {
  let comp: FavouritesListDeleteDialogComponent;
  let fixture: ComponentFixture<FavouritesListDeleteDialogComponent>;
  let service: FavouritesListService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FavouritesListDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(FavouritesListDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FavouritesListDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FavouritesListService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
