import { Component, OnInit, ViewChild } from '@angular/core';
import { FormAuthorComponent } from '../components/form-author/form-author.component';
import { AuthorsService } from '@services/authors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { authorCreation } from '@interfaces/author.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-author-edit',
  standalone: true,
  imports: [FormAuthorComponent],
  templateUrl: './author-edit.component.html',
  styleUrl: './author-edit.component.scss',
})
export class AuthorEditComponent implements OnInit {
  @ViewChild(FormAuthorComponent) formAuthor!: FormAuthorComponent;

  constructor(
    private authorSvc: AuthorsService,
    private actRoute: ActivatedRoute,
    private route: Router
  ) {}
  id!: number;
  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params['id'];
    this.authorSvc.getAuthorById(this.id).subscribe((res) => {
      this.formAuthor.form.patchValue({
        name: res.name,
        birthDate: res.birthDate,
        countryId: res.country.id,
        biography: res.biography,
      });
    });
  }
  save(body: authorCreation) {
    this.authorSvc.updateAuthor(this.id, body).subscribe(async (res) => {
      await Swal.fire({
        title: 'Operación realizada con éxito',
        text: 'El autor ha sido actualizado con éxito',
        icon: 'success',
      });
      this.route.navigate(['/authors']);
    });
  }
}
