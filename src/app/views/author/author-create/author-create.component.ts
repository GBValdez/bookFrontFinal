import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { authorCreation } from '@interfaces/author.interface';
import { AuthorsService } from '@services/authors.service';
import Swal from 'sweetalert2';
import { FormAuthorComponent } from '../components/form-author/form-author.component';

@Component({
  selector: 'app-author-create',
  standalone: true,
  imports: [FormAuthorComponent],
  templateUrl: './author-create.component.html',
  styleUrl: './author-create.component.scss',
})
export class AuthorCreateComponent {
  constructor(private route: Router, private authorSvc: AuthorsService) {}

  save(newAuth: authorCreation) {
    this.authorSvc.createAuthor(newAuth).subscribe(async (res) => {
      await Swal.fire({
        title: 'Operación realizada con éxito',
        text: 'El autor ha sido creado con éxito',
        icon: 'success',
      });
      this.route.navigate(['/authors']);
    });
  }
}
