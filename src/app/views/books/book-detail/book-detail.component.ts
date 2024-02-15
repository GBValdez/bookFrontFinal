import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { bookDto } from '@interfaces/book.interface';
import { commentsDto } from '@interfaces/comments.interface';
import { AuthService } from '@services/auth.service';
import { BookService } from '@services/book.service';
import { CommentsService } from '@services/comments.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    DatePipe,
    MatChipsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss',
})
export class BookDetailComponent implements OnInit {
  id!: number;
  idCommentEdit?: number;
  form: FormGroup = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(600)]],
  });

  constructor(
    private bookSvc: BookService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private commentSvc: CommentsService,
    private authSvc: AuthService
  ) {}
  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params['id'];
    this.getBook();
    if (this.authSvc.hasAuth()) {
      this.canComment = true;
      this.canEdit = this.authSvc.getAuth()!.roles.includes('ADMINISTRATOR');
    }
  }
  book!: bookDto;
  comments: commentsDto[] = [];
  indexComments: number = 1;
  numPageComments!: number;
  canComment: boolean = false;
  canEdit: boolean = false;
  getBook() {
    this.bookSvc.get(this.id, true).subscribe((book) => {
      this.book = book;
      this.getComments();
    });
  }
  getComments() {
    this.commentSvc.getAll(this.indexComments, 5, this.id).subscribe((res) => {
      const resFiltered = res.items.filter((comment) => {
        return !this.comments.some(
          (c) =>
            c.content === comment.content &&
            c.user.userName === comment.user.userName
        );
      });
      this.comments = [...this.comments, ...resFiltered];
      this.numPageComments = res.totalPages;
    });
  }

  clickButtonEditComment(comment: commentsDto) {
    this.idCommentEdit = comment.id;
    this.form.patchValue({ content: comment.content });
  }
  cancelEditComment() {
    this.idCommentEdit = undefined;
    this.form.patchValue({ content: '' });
  }
  moreComments() {
    this.indexComments++;
    this.getComments();
  }

  async deleteBook() {
    const result = await Swal.fire({
      title: `'¿Desea eliminar el autor "${this.book.title}"?'`,
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    });
    if (result.isConfirmed) {
      this.bookSvc.delete(this.book.id).subscribe(async (res) => {
        await Swal.fire({
          title: 'El autor fue eliminado correctamente',
          icon: 'success',
        });
        this.router.navigate(['/books']);
      });
    }
  }
  async sendComment() {
    if (this.form.invalid) {
      return;
    }
    const MESSAGE: string = this.idCommentEdit ? 'editar' : 'enviar';
    const result = await Swal.fire({
      title: `¿Desea ${MESSAGE} el comentario?`,
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    });
    if (result.isConfirmed) {
      if (this.idCommentEdit) {
        this.commentSvc.update(this.form.value, this.idCommentEdit).subscribe(
          (res) => {
            Swal.fire({
              title: 'El comentario fue editado correctamente',
              icon: 'success',
            });
            this.comments = this.comments.map((c) => {
              if (c.id === this.idCommentEdit) {
                c.content = this.form.value.content;
              }
              return c;
            });
            this.idCommentEdit = undefined;
            this.form.patchValue({ content: '' });
          },
          (err) => {
            Swal.fire({
              title: 'Error al editar el comentario',
              icon: 'error',
            });
          }
        );
      } else
        this.commentSvc.post(this.form.value, this.id).subscribe((res) => {
          Swal.fire({
            title: 'El comentario fue enviado correctamente',
            icon: 'success',
          });
          this.form.patchValue({ content: '' });
          res.user = { userName: this.authSvc.getAuth()!.userName!, email: '' };
          this.comments = [...this.comments, res];
        });
    }
  }
  async deleteComment(comment: commentsDto) {
    const result = await Swal.fire({
      title: '¿Desea eliminar el comentario?',
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    });
    if (result.isConfirmed) {
      this.commentSvc.delete(comment.id, this.id).subscribe((res) => {
        Swal.fire({
          title: 'El comentario fue eliminado correctamente',
          icon: 'success',
        });
        this.comments = this.comments.filter((c) => c.id !== comment.id);
      });
    }
  }
}
