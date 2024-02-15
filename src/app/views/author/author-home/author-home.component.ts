import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { authorDto, authorQueryFilter } from '@interfaces/author.interface';
import { AuthorsService } from '@services/authors.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CatalogueService } from '@services/catalogue.service';
import { catalogueInterface } from '@interfaces/commons.interface';
import { InputAutocompleteComponent } from '@components/input-autocomplete/input-autocomplete.component';
import { formIsEmptyValidator } from '@utilsFunctions/utils';
import { AuthService } from '@services/auth.service';
import { convertMomentToDate } from '@utilsFunctions/formatDate';

@Component({
  selector: 'app-author-home',
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    MatButtonModule,
    RouterModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    InputAutocompleteComponent,
  ],
  templateUrl: './author-home.component.html',
  styleUrl: './author-home.component.scss',
})
export class AuthorHomeComponent implements OnInit {
  constructor(
    private authorSvc: AuthorsService,
    private catalogueSvc: CatalogueService,
    private fb: FormBuilder,
    private authSvc: AuthService
  ) {}
  listAuthors: authorDto[] = [];

  sizeAuthors: number = 0;
  indexPage: number = 0;
  pageSize: number = 10;

  countriesOpts: catalogueInterface[] = [];
  urlCatalogue = 'country';
  canAddAuthor: boolean = false;
  form: FormGroup = this.fb.group(
    {
      nameCont: [],
      birthDateGreat: [],
      birthDateSmall: [],
      countryId: [],
    },
    { validators: formIsEmptyValidator() }
  );
  formValues: authorQueryFilter = {};
  cleanFilters() {
    this.form.patchValue({
      nameCont: null,
      birthDateGreat: null,
      birthDateSmall: null,
      countryId: null,
    });
    this.formValues = {};
    this.indexPage = 0;
    this.getAuthors(this.indexPage, this.pageSize);
  }

  searchAuthors() {
    this.indexPage = 0;
    this.formValues = this.form.value;
    if (this.formValues.birthDateSmall)
      this.formValues.birthDateSmall.set({ hour: 23, minute: 59, second: 59 });
    this.getAuthors(this.indexPage, this.pageSize);
  }

  ngOnInit(): void {
    if (this.authSvc.hasAuth())
      this.canAddAuthor = this.authSvc
        .getAuth()!
        .roles.includes('ADMINISTRATOR');

    this.getAuthors(this.indexPage, this.pageSize);

    this.catalogueSvc
      .get(this.urlCatalogue, 1, 10, {})
      .subscribe((countries) => {
        this.countriesOpts = countries.items;
      });
  }

  getAuthors(pageNumber: number, pageSize: number) {
    this.authorSvc
      .getAuthors(pageSize, pageNumber + 1, this.formValues)
      .subscribe((res) => {
        if (res.total > 0) {
          this.listAuthors = res.items;
          this.sizeAuthors = res.total;
        } else {
          Swal.fire({
            title: 'No se encontraron autores',
            icon: 'warning',
          });
        }
      });
  }
  changePagination(event: PageEvent) {
    this.indexPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAuthors(this.indexPage, this.pageSize);
  }

  async deleteAuthor(author: authorDto) {
    const result = await Swal.fire({
      title: `'¿Desea eliminar el autor "${author.name}"?'`,
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    });
    if (result.isConfirmed) {
      this.authorSvc.deleteAuthor(author.id).subscribe((res) => {
        this.indexPage = 0;
        this.getAuthors(this.indexPage, this.pageSize);
        Swal.fire({
          title: 'El autor fue eliminado correctamente',
          icon: 'success',
        });
      });
    }
  }
}
