import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    price: new FormControl(''),
    old_price: new FormControl(''),
    color: new FormControl(''),
    made_in: new FormControl(''),
    brand: new FormControl(''),
    img: new FormControl(''),
});
submitted = false;
  currentProduct: Product = {
    name: '',
    price: 0,
    old_price: 0,
    discount: '',
    gender: '',
    color: '',
    made_in: '',
    brand: '',
    img: '',
  };
  message = '';

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.productService.seachProduct(this.route.snapshot.params['_id'])
      .subscribe(
        data => {
          this.currentProduct = data;
          this.form = this.formBuilder.group(
            {
              name: [this.currentProduct.name, Validators.required],
              price: [this.currentProduct.price, [
                Validators.required,
                Validators.pattern(/^-?(0|[1-9]\d*)?$/)
              ]],
              old_price: [this.currentProduct.old_price, [
                Validators.required,
                Validators.pattern(/^-?(0|[1-9]\d*)?$/)
              ]],
              color: [this.currentProduct.color, Validators.required],
              made_in: [this.currentProduct.made_in, Validators.required],
              brand: [this.currentProduct.brand, Validators.required],
              img: [this.currentProduct.img, Validators.required],
            },
          );
        },
        error => {
          console.log(error);
        });
  
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  
  updateProduct(){
    this.submitted = true;
    //  ??i???u ki???n check n???u t???t c??? gi?? tr??? h???p l??? th?? th??m sp
      if (this.form.invalid) {
        return;
      }
      
    Swal.fire({
      title: 'B???n c?? mu???n l??u s??? thay ?????i?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'L??u',
      denyButtonText: `kh??ng l??u`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('???? l??u!', '', 'success')
        this.productService.update(this.currentProduct._id, this.form.value)
        .subscribe(
          response => {
            this.router.navigate(['/productList']);
          },
          error => {
            console.log(error);
          });
      } else if (result.isDenied) {
        Swal.fire('L??u kh??ng thay ?????i', '', 'info')
      }
    })
  }

  
  deleteProduct(): void {
    Swal.fire({
      title: 'B???n c?? ch???c kh??ng?',
      text: "B???n s??? kh??ng th??? ho??n nguy??n ??i???u n??y!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'V??ng t??i ch???c!',
      cancelButtonText:'Hu???'

    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Xo?? th??nh c??ng',
          showConfirmButton: false,
          timer: 1500
        })
        this.productService.delete(this.currentProduct._id)
        .subscribe(
          response => {
            this.router.navigate(['/productList']);
          },
          error => {
            console.log(error);
          });
      }
    })
  }
}
