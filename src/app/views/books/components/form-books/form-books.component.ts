import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { InputAutocompleteComponent } from '@components/input-autocomplete/input-autocomplete.component';
import { ListMakerListComponent } from '@components/list-maker-list/list-maker-list.component';
import { OnlyNumberInputDirective } from '@directives/onlyNumberDir/only-number-input.directive';
import { OnlyNumberInputModule } from '@directives/onlyNumberDir/only-number-input.module';
import { bookCreationDto } from '@interfaces/book.interface';
import { catalogueInterface } from '@interfaces/commons.interface';
import { AuthorsService } from '@services/authors.service';
import { CatalogueService } from '@services/catalogue.service';
import { convertMomentToDate } from '@utilsFunctions/formatDate';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-books',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    ListMakerListComponent,
    InputAutocompleteComponent,
    OnlyNumberInputModule,
  ],
  templateUrl: './form-books.component.html',
  styleUrl: './form-books.component.scss',
})
export class FormBooksComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authorSvc: AuthorsService,
    private catalogueSvc: CatalogueService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.catalogueSvc.get('language', 1, 10, {}).subscribe((res) => {
      this.optLanguages = res.items;
    });
    this.catalogueSvc.get('category', 1, 10, {}).subscribe((res) => {
      this.optCategories = res.items;
    });
  }

  @Output() saveEvent: EventEmitter<bookCreationDto> = new EventEmitter();

  urlCatalogue = 'language';
  optLanguages: catalogueInterface[] = [];
  optAuthors: catalogueInterface[] = [];
  optCategories: catalogueInterface[] = [];
  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    dateCreation: ['', [Validators.required]],
    numPages: ['', [Validators.required]],
    languageId: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.maxLength(250)]],
    authorIds: ['', [Validators.required]],
    categoriesId: ['', [Validators.required]],
  });

  foundingAuthor(value: string): void {
    if (value.trim() === '') return;
    this.authorSvc.getAuthorByName(value).subscribe((res) => {
      this.optAuthors = res.map((author) => {
        return { id: author.id, name: author.name };
      });
    });
  }

  cleanGeneralForm(): void {
    this.form.patchValue({
      title: '',
      dateCreation: '',
      numPages: '',
      languageId: '',
      description: '',
    });
  }

  cleanPropertiesForm(prop: string): void {
    let object: any = {};
    object[prop] = [];
    this.form.patchValue(object);
  }

  async noExistCategory(value: string) {
    const RES = await Swal.fire({
      title: `No existe la categoría "${value}"`,
      text: '¿Desea agregarla?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    });
    if (RES.isConfirmed)
      this.catalogueSvc.create({ name: value }, 'category').subscribe((res) => {
        this.optCategories = [...this.optCategories, res];
        Swal.fire({
          title: 'Categoría agregada',
          text: 'La categoría ha sido agregada',
          icon: 'success',
          timer: 2000,
        });
      });
  }

  async noExistLanguage(language: string) {
    const RES = await Swal.fire({
      title: `No existe el idioma "${language}"`,
      text: '¿Desea agregarlo?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    });
    if (RES.isConfirmed)
      this.catalogueSvc
        .create({ name: language }, this.urlCatalogue)
        .subscribe((res) => {
          this.optLanguages = [...this.optLanguages, res];
          this.form.patchValue({ languageId: res.id });
          Swal.fire({
            title: 'Idioma agregado',
            text: 'El Idioma ha sido agregado',
            icon: 'success',
            timer: 2000,
          });
        });
  }

  cancel(): void {
    this.router.navigate(['/books']);
  }

  async save() {
    if (this.form.valid) {
      const RES = await Swal.fire({
        title: '¿Está seguro?',
        text: '¿Desea guardar los cambios?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      });
      if (RES.isConfirmed)
        this.saveEvent.emit(convertMomentToDate(this.form.value));
    } else {
      this.form.markAllAsTouched();
    }
  }
}
