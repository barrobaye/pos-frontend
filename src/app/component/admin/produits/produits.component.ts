import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import {RouterLink} from "@angular/router";
import {ProductService} from '../../../services/product/product.service';
import {Product} from '../../../common/product';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CategoryService} from '../../../services/category/category.service';
import {ProductCategory} from '../../../common/product-category';
import {response} from 'express';
import {AdminService} from '../../../services/auth/admin/admin.service';
import {Admin} from '../../../common/admin';
import {Surplus} from '../../../common/surplus';
import {ProductSup} from '../../../common/productSup';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [
    MenuComponent,
    RouterLink,
    NgForOf,
    DatePipe,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.scss'
})
export class ProduitsComponent implements OnInit{
  products :any[] = [];
  produitForm!:FormGroup;
  categoryForm!:FormGroup;
  inputs!: FormArray;

  constructor(private produitService:ProductService,
              private formBuilder:FormBuilder,private categoryService:CategoryService,
              private authService:AdminService)  {

    this.categoryForm  = this.formBuilder.group({
      categoryName:[''],
        imgUrl:[]
    });
    this.produitForm = this.formBuilder.group({
          sku:[],
          name:[],
          description:[],
          unitPrice:[],
          unitStock:[],
          imageUrl:[],
          admin:this.formBuilder.group({
            login:[this.authService.getLoginA()]
          }),
          category:this.formBuilder.group({
            categoryId:[]
          }),
          inputs: this.formBuilder.array([this.createInput()])

    });
    this.inputs = this.produitForm.get('inputs') as FormArray;
  }


  addInput() {
    this.inputs.push(this.createInput());
  }
  createInput(): FormGroup {
    return this.formBuilder.group({
      price: [0],
      name:['']
    });
  }

  imageCategory!:File;
  onFileSelected(event: Event) {
    const fileInput:any  = event.target as HTMLInputElement;
    if (fileInput.files.length > 0) {
      this.imageCategory = fileInput.files[0];

    }
  }
  imageProduit!:File;
  onFileSelected1(event: Event) {
    const fileInput:any  = event.target as HTMLInputElement;
    if (fileInput.files.length > 0) {
      this.imageProduit = fileInput.files[0];

    }
  }



admin = 1;
  onSubmit(){
      // let formData = new FormData();
      // formData.append('sku',this.produitForm.value['sku']);
      // formData.append('name',this.produitForm.value['name']);
      // formData.append('description',this.produitForm.value['description']);
      // formData.append('unitPrice',this.produitForm.value['unitPrice']);
      // formData.append('unitStock',this.produitForm.value['unitStock']);
      // formData.append('image',this.imageProduit);
      // formData.append('categoryId',this.produitForm.value['categoryId']);
      // formData.append('adminId',this.admin);


    // let Product
    //
      let product = new Product();
      product.sku = this.produitForm.value['sku'];
      product.name = this.produitForm.value['name'];
      product.description = this.produitForm.value['description'];
      product.unitPrice = this.produitForm.value['unitPrice'];
      product.unitsInStock = this.produitForm.value['unitStock'];
      let categoryN = new ProductCategory();
      categoryN.id=this.produitForm.value['category'].categoryId;
      product.category = categoryN;

      let adminN = new Admin();
      adminN.login = this.produitForm.value['admin'].login;
      product.admin =adminN;
    const inputs = this.produitForm.value.inputs;
      const surplusL :Surplus[]=[];
      for(let i=0;i<inputs.length;i++){
        const surplus = new Surplus();
        surplus.name = inputs[i].name;
        surplus.priceS = inputs[i].price;
        surplusL.push(surplus);
      }

      let productSup = new ProductSup();
      productSup.product = product;
      productSup.surplus = surplusL;


      // productSup.imageP = this.imageProduit;



      // product.imageUrl = this.imageProduit;

    const formData = new FormData();
    formData.append('productSup', new Blob([JSON.stringify(productSup)], { type: 'application/json' }));
    formData.append('imageP',this.imageProduit);
      console.log(productSup);
      this.produitService.createProduct(formData).subscribe(
        {
          next:response=>{
            alert(`Produit ${name} ajoute avec succe`);
            this.produitForm.reset();
            this.addView = false;
            window.location.reload();
          },
          error:err=>{
            alert(`Quelque chose n'a pas marche :${err.message}`)
          }
        }
      )

  }

  onSubmit1() {
    let formData = new FormData();
    formData.append('categoryName', this.categoryForm.controls['categoryName'].value);
    formData.append('image', this.imageCategory);

    this.categoryService.saveCategory(formData).subscribe(
      {
        next:response=>{
          alert(`Category ${this.categoryForm.value['categoryName']} est bien cree`);
          this.categoryForm.reset();
          this.addCategory = false;
          window.location.reload();
        },
        error:err=>{
          alert(`Quelque chose n'a pas marche : ${err.message}`)
        }
      }
    )
    console.log(formData);
  }
  categories!:any;
  listCategory(){
    this.categoryService.listCategory().subscribe(
      res=>{
        this.categories = res;
        console.log(this.categories);
      }
    );
  }

  addView = false;
  addCategory = false;
  ngOnInit() {
    this.listProduits();
    this.listCategory();
  }

  showCategory(){
    this.addCategory = true;
  }
  closeCategory(){
    this.addCategory = false;
  }
  showAdd(){
    this.addView = true;
  }

  closeModal(){
    this.addView = false;
    this.upView = false;
    this.produitForm.reset();
  }


  listProduits(){
    this.produitService.getProducts().subscribe(
      res=>{
      this.products = res;
      console.log(this.products);
      }
    )
  }

  deleteProd(id:any){
    if(confirm("Voulez-vous vraiment supprimer ce produit")){
      this.produitService.deleteProduct(id).subscribe(
        {
          next:response=>{
            alert(`Produit supprimer `);
            window.location.reload();
          },
          error:err=>{
            alert("Quelque chose ne s'est pas bien passee")
          }
        }
      )
    }
  }

  prod!:any;
  updateProd = false;
  upView = false;
  name = "";
  viewProduit(id:any,update:boolean){
    if(update == true){
      this.produitService.getProductById(id).subscribe(
        res=>{
          this.prod = res;
          this.name = res.name;
          console.log(this.prod);

          this.produitForm = this.formBuilder.group({
              // imageUrl:[this.prod.imageUrl],
              name:[this.prod.name],
              description:[this.prod.description],
              sku:[this.prod.sku],
              unitPrice:[this.prod.unitPrice],
              unitStock:[this.prod.unitsInStock],
              active:[this.prod.active],
              categoryId:[this.prod.categoryDTO.id]
          })
        }
      )
      this.addView = true;

    }else{
      this.produitService.getProductById(id).subscribe(
        res=>{
          this.prod = res;
          console.log(this.prod.categoryDTO.categoryName);
          this.upView = true;
        }
      )
    }
  }

}
