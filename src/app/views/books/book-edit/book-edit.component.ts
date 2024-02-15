import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBooksComponent } from '../components/form-books/form-books.component';
import { bookCreationDto } from '@interfaces/book.interface';
import { BookService } from '@services/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [FormBooksComponent],
  templateUrl: './book-edit.component.html',
  styleUrl: './book-edit.component.scss',
})
export class BookEditComponent implements OnInit {
  @ViewChild(FormBooksComponent) formBook!: FormBooksComponent;

  id!: number;
  constructor(
    private bookSvc: BookService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params['id'];
    this.bookSvc.get(this.id).subscribe((res) => {
      this.formBook.form.patchValue({
        title: res.title,
        dateCreation: res.dateCreation,
        numPages: res.numPages,
        languageId: res.language.id,
        description: res.description,
        authorIds: res.authors.map((x) => {
          return {
            id: x.id,
            name: x.name,
          };
        }),
        categoriesId: res.categories,
      });
    });
  }
  save(newBook: bookCreationDto) {
    this.bookSvc.put(this.id, newBook).subscribe(async (res) => {
      await Swal.fire(
        'Operación Realizada con éxito',
        'El libro ha sido actualizado',
        'success'
      );
      this.router.navigate(['/books']);
    });
  }
}
