import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ListMakerListComponent } from '@components/list-maker-list/list-maker-list.component';
import { catalogueInterface } from '@interfaces/commons.interface';
import { UserDto, userUpdateDto } from '@interfaces/user.interface';
import { RolService } from '@services/rol.service';
import { UserAdminService } from '@services/user-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    ListMakerListComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userSvc: UserAdminService,
    private actRoute: ActivatedRoute,
    private rolSvc: RolService
  ) {}
  userName: string = '';
  userEdit!: UserDto;
  form: FormGroup = this.fb.group({
    roles: [[], [Validators.required]],
    status: [true, [Validators.required]],
  });
  ngOnInit(): void {
    this.userName = this.actRoute.snapshot.params['userName'];
    this.userSvc.getUserByUserName(this.userName).subscribe((res) => {
      this.userEdit = res;
      if (res.roles) {
        const rolesObj: any = {
          roles: res.roles.map((rol): catalogueInterface => {
            return {
              id: rol,
              name: rol,
            };
          }),
          status: res.isActive,
        };

        this.form.patchValue(rolesObj);
      }
    });
  }

  rolOpt: catalogueInterface[] = [];

  cancel() {
    this.router.navigate(['/user/home']);
  }
  clean() {
    this.form.patchValue({
      roles: [],
    });
  }
  foundRoles(rol: string) {
    this.rolSvc.getRoles(1, 10, true, rol).subscribe((res) => {
      this.rolOpt = res.items.map((rol) => {
        return {
          id: rol.name,
          name: rol.name,
        };
      });
    });
  }
  async save() {
    if (this.form.valid) {
      const result = await Swal.fire({
        title: '¿Estás seguro de actualizar el usuario?',
        showCancelButton: true,
        confirmButtonText: `Actualizar`,
        icon: 'question',
      });
      if (result.isConfirmed) {
        this.userSvc
          .updateUser(this.form.value, this.userName)
          .subscribe(async (res) => {
            await Swal.fire('El usuario ha sido actualizado', '', 'success');
            this.router.navigate(['/user/home']);
          });
      }
    } else this.form.markAllAsTouched();
  }
}
