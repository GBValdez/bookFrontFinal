import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { BookService } from '@services/book.service';
import { bookDto, bookQueryFilter } from '@interfaces/book.interface';
import { MatMenuModule } from '@angular/material/menu';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { MatChipsModule } from '@angular/material/chips';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

import { InputAutocompleteComponent } from '@components/input-autocomplete/input-autocomplete.component';
import { CatalogueService } from '@services/catalogue.service';
import { catalogueInterface } from '@interfaces/commons.interface';
import { MatSelectModule } from '@angular/material/select';
import { OnlyNumberInputModule } from '@directives/onlyNumberDir/only-number-input.module';
import { formIsEmptyValidator } from '@utilsFunctions/utils';
import { AuthService } from '@services/auth.service';
import { convertMomentToDate } from '@utilsFunctions/formatDate';
@Component({
  selector: 'app-book-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    RouterModule,
    MatMenuModule,
    DatePipe,
    MatIconModule,
    MatPaginatorModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    InputAutocompleteComponent,
    MatSelectModule,
    OnlyNumberInputModule,
  ],
  templateUrl: './book-home.component.html',
  styleUrl: './book-home.component.scss',
})
export class BookHomeComponent {
  constructor(
    private bookSvc: BookService,
    private router: Router,
    private fb: FormBuilder,
    private catalogueSvc: CatalogueService,
    private authSvc: AuthService
  ) {}
  bookList: bookDto[] = [];

  indexPage: number = 0;
  pageSize: number = 10;
  sizeBooks: number = 0;

  languagesOpts: catalogueInterface[] = [];
  categoriesOpts: catalogueInterface[] = [];
  canEdit: boolean = false;
  form: FormGroup = this.fb.group(
    {
      titleCont: [],
      dateCreationGreat: [],
      dateCreationSmall: [],
      numPages: [],
      languageId: [],
      categoriesId: [],
    },
    { validators: formIsEmptyValidator() }
  );
  formValue: bookQueryFilter = {};
  cleanFilters() {
    this.form.patchValue({
      titleCont: '',
      dateCreationGreat: '',
      dateCreationSmall: '',
      numPages: '',
      languageId: '',
      categoriesId: '',
    });
    this.indexPage = 0;
    this.formValue = {};
    this.getBooks(this.indexPage, this.pageSize);
  }

  searchBooks() {
    this.formValue = this.form.value;
    if (this.formValue.dateCreationSmall) {
      this.formValue.dateCreationSmall.set({
        hour: 23,
        minute: 59,
        second: 59,
      });
    }
    this.indexPage = 0;
    this.getBooks(this.indexPage, this.pageSize);
  }

  ngOnInit(): void {
    if (this.authSvc.hasAuth()) {
      this.canEdit = this.authSvc.getAuth()!.roles.includes('ADMINISTRATOR');
    }

    this.getBooks(this.indexPage, this.pageSize);

    this.catalogueSvc.get('language', 1, 10).subscribe((res) => {
      this.languagesOpts = res.items;
    });

    this.catalogueSvc.get('category', 1, 10).subscribe((res) => {
      this.categoriesOpts = res.items;
    });
  }

  changePagination(event: PageEvent) {
    this.indexPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getBooks(this.indexPage, this.pageSize);
  }

  getBooks(pageNumber: number, pageSize: number) {
    this.bookSvc
      .getAll(pageNumber + 1, pageSize, this.formValue)
      .subscribe((res) => {
        if (res.total > 0) {
          this.bookList = res.items;
          this.sizeBooks = res.total;
        } else {
          Swal.fire({
            title: 'No se encontraron libros',
            icon: 'warning',
          });
        }
      });
  }
  async deleteBook(book: bookDto) {
    const result = await Swal.fire({
      title: `'¿Desea eliminar el libro "${book.title}"?'`,
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    });
    if (result.isConfirmed) {
      this.bookSvc.delete(book.id).subscribe((res) => {
        this.indexPage = 0;
        this.getBooks(this.indexPage, this.pageSize);
        Swal.fire({
          title: 'El libro fue eliminado correctamente',
          icon: 'success',
        });
      });
    }
  }
}
