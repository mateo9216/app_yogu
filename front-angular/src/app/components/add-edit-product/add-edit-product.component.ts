import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  id: number;
  operacion: string = 'Agregar ';

  constructor(
    private fb: FormBuilder,
    private _productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [null, Validators.required],
    });
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id !== 0) {
      // Es editar
      this.operacion = 'Editar ';
      this.getProduct(this.id);
    }
  }

  getProduct(id: number) {
    this.loading = true;
    this._productService.getProduct(id).subscribe((data: Product) => {
      this.loading = false;
      this.form.patchValue({
        name: data.name,
        price: data.price,
      });
    });
  }

  addProduct() {
    const product: Product = {
      id: this.id,
      name: this.form.value.name,
      price: this.form.value.price,
    };
    this.loading = true;

    if (this.id !== 0) {
      // Es editar
      this._productService.updateProduct(product).subscribe(() => {
        this.toastr.info(`El producto ${product.name} fue actualizado con éxito`, 'Producto actualizado');
        this.loading = false;
        this.router.navigate(['/']);
      });
    } else {
      // Es agregar
      this._productService.saveProduct(product).subscribe(() => {
        this.toastr.success(`El producto ${product.name} fue registrado con éxito`, 'Producto registrado');
        this.loading = false;
        this.router.navigate(['/']);
      });
    }
  }
}
