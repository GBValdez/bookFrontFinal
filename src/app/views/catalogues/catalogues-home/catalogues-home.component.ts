import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  catalogueInterface,
  catalogueModal,
} from '@interfaces/commons.interface';
import { CatalogueService } from '@services/catalogue.service';
import { formIsEmptyValidator } from '@utilsFunctions/utils';
import Swal from 'sweetalert2';
import { CatalogueFormComponent } from '../catalogue-form/catalogue-form.component';

@Component({
  selector: 'app-catalogues-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    FormsModule,
  ],
  templateUrl: './catalogues-home.component.html',
  styleUrl: './catalogues-home.component.scss',
})
export class CataloguesHomeComponent implements OnInit {
  constructor(
    private actRouter: ActivatedRoute,
    private fb: FormBuilder,
    private catalogueSvc: CatalogueService,
    private dialog: MatDialog
  ) {}
  title: string = '';
  typeCatalogue: string = '';
  form: FormGroup = this.fb.group(
    {
      nameCont: [''],
    },
    {
      validators: formIsEmptyValidator(),
    }
  );
  catalogues: catalogueInterface[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  catalogueSize: number = 0;

  ngOnInit(): void {
    this.title = this.actRouter.snapshot.data['titleShow'];
    this.typeCatalogue = this.actRouter.snapshot.data['typeCatalogue'];
    this.getCatalogues(this.pageNumber, this.pageSize);
  }

  getCatalogues(pageNumber: number, pageSize: number) {
    this.catalogueSvc
      .get(this.typeCatalogue, pageNumber + 1, pageSize, this.form.value, false)
      .subscribe((res) => {
        if (res.total > 0) {
          this.catalogues = res.items;

          this.catalogueSize = res.total;
        } else {
          Swal.fire('No se encontraron registros', '', 'info');
        }
      });
  }
  changePagination(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getCatalogues(this.pageNumber, this.pageSize);
  }
  async deleteCatalogue(catalogue: catalogueInterface) {
    const result = await Swal.fire({
      title: '¿Estas seguro de eliminar este registro?',
      text: `Eliminar ${catalogue.name}`,
      icon: 'warning',
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      this.catalogueSvc
        .delete(catalogue.id!, this.typeCatalogue)
        .subscribe(async () => {
          await Swal.fire('Eliminado', 'Registro eliminado', 'success');
          this.pageNumber = 0;
          this.getCatalogues(this.pageNumber, this.pageSize);
        });
    }
  }

  searchCatalogue() {
    this.pageNumber = 0;
    this.getCatalogues(this.pageNumber, this.pageSize);
  }
  cleanForm() {
    this.form.patchValue({ nameCont: '' });
    this.pageNumber = 0;
    this.getCatalogues(this.pageNumber, 10);
  }

  openForm(catalogue?: catalogueInterface) {
    const dataModal: catalogueModal = {
      typeCatalogue: this.typeCatalogue,
      title: this.title,
      catalogue,
    };
    this.dialog
      .open(CatalogueFormComponent, {
        width: '60%',
        minWidth: '280px',
        data: dataModal,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res?.modify) {
          this.getCatalogues(this.pageNumber, this.pageSize);
        }
      });
  }
}
