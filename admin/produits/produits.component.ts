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
<<<<<<< HEAD
=======
import { ApiUrlService } from '../../../core/api-url.service';
>>>>>>> mon-travail-local


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
  selectedImageUrl: string | null = null;


  ngOnInit() {
    this.listProduits();
    this.listCategory();
  }
<<<<<<< HEAD
=======


>>>>>>> mon-travail-local
//Parti Catégorie
  categories!:any;
  listCategory(){
    this.categoryService.listCategory().subscribe(
      res=>{
        this.categories = res;
<<<<<<< HEAD
        console.log(this.categories); 
=======
       // console.log(this.categories); 
>>>>>>> mon-travail-local
      }
    );
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
  imageCategory!:File;
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.imageCategory = fileInput.files[0];
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrl = e.target.result;
      };
      reader.readAsDataURL(this.imageCategory);
    }
  }

// End Categorie
  constructor(private produitService:ProductService,
<<<<<<< HEAD
              private formBuilder:FormBuilder,private categoryService:CategoryService,
              private authService:AdminService)  {
=======
              private formBuilder:FormBuilder,
              private categoryService:CategoryService,
              private authService:AdminService,
              public apiUrlService: ApiUrlService)  {
>>>>>>> mon-travail-local

    this.categoryForm  = this.formBuilder.group({
      categoryName:[''],
        imgUrl:[]
    });
    this.produitForm = this.formBuilder.group({
      sku: [''],
      name: [''],
      description: [''],
      unitPrice: [0],
      unitStock: [0],
      image: [null], // doit correspondre au formControlName dans le HTML
    
      categoryId: [null], // à plat comme dans <select>
  
  // Pas besoin d'un formGroup pour admin, juste récupérer le login directement
  admin: [this.authService.getLoginA() || '1'], // Login par défaut '1'
      inputs: this.formBuilder.array([this.createInput()])
    });
  
    this.inputs = this.produitForm.get('inputs') as FormArray;
  }


//touch01



//touch01

/*   onFileSelected(event: Event) {
    const fileInput:any  = event.target as HTMLInputElement;
    if (fileInput.files.length > 0) {
      this.imageCategory = fileInput.files[0];

    }
  } */
  imageProduit!: File;
  selectedImage: string | null = null;
  
  onFileSelected1(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
  
    if (fileInput.files && fileInput.files.length > 0) {
      this.imageProduit = fileInput.files[0];
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result; // Mise à jour de l'aperçu de l'image
      };
      reader.readAsDataURL(this.imageProduit);
    }
  }


//admin = 1;
 /*  onSubmit(){
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
      this.produitService.saveProduct(formData).subscribe(
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

  } */



 
//modal
  addView = false;
  addCategory = false;


  showCategory(){
    this.addCategory = true;
  }
  closeCategory(){
    this.addCategory = false;
  }
  showAdd(){
    this.addView = true;
  } 
  showUp(){
    this.upView = true;
  } 

  closeModal(){
    this.addView = false;
    this.upView = false;
    this.produitForm.reset();
  }
   //End Modal

//produits
  listProduits(){
    this.produitService.getProducts().subscribe(
      res=>{
      this.products = res;
      console.log(this.products);
      }
    )
  }

  onSubmit() {
    // Création du FormData
    const formData = new FormData();
    const formValue = this.produitForm.value;

       // Récupère le login directement via l'authService (ou '1' par défaut si aucun login n'est trouvé)
  const adminLogin = this.authService.getLoginA() || '1L'; 

  // Ajoute le login dans le FormData sans avoir besoin de l'input caché
  formData.append('admin', adminLogin);
    // Ajout des champs du produit
    formData.append('name', this.produitForm.value['name']);
    formData.append('sku', this.produitForm.value['sku']);
    formData.append('description', this.produitForm.value['description']);
    formData.append('unitPrice', this.produitForm.value['unitPrice']);
    formData.append('unitStock', this.produitForm.value['unitStock']);
    formData.append('categoryId', this.produitForm.value.categoryId);
    //formData.append('active', this.produitForm.value.active);
<<<<<<< HEAD
  
=======
      // Ajouter seulement si les surplus existent et sont valides
// Filtrage des surplus valides

>>>>>>> mon-travail-local

  /*   const categoryId = typeof formValue.categoryId === 'object'
    ? formValue.categoryId?.id
    : formValue.categoryId;
  
  if (categoryId) {
    formData.append('categoryId', categoryId.toString());
  } */

    // Image
  if (this.imageProduit) {
    formData.append('image', this.imageProduit, this.imageProduit.name);
  } else {
    alert('Veuillez sélectionner une image');
    return;
  }
    // Ajout de l'image
   /*  if (this.imageProduit) {
      formData.append('image', this.imageProduit, this.imageProduit.name);
    } */
  
    // Ajout des surplus
    const inputs = this.produitForm.value.inputs;
<<<<<<< HEAD
    for (let i = 0; i < inputs.length; i++) {
      formData.append('surplusNames', inputs[i].name);
      formData.append('surplusPrices', inputs[i].price);
    }
=======

    if (inputs && inputs.length > 0) {
      for (let i = 0; i < inputs.length; i++) {
        const name = inputs[i].name;
        const price = inputs[i].price;
    
        // S'assurer que les deux valeurs sont présentes
        if (name && price !== null && price !== undefined) {
          formData.append('surplusNames', name);
          formData.append('surplusPrices', price.toString());
        }
      }
    }

>>>>>>> mon-travail-local
   //voir les donnés avant l'envoi   
    // ===== LOGGING COMPLET =====
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    // Envoi au service
    this.produitService.saveProduct(formData).subscribe({
      next: (response) => {
        alert(`Produit ${this.produitForm.value['name']} ajouté avec succès`);
        this.produitForm.reset();
        this.addView = false;
        this.listProduits(); // Rafraîchir la liste au lieu de reload
      },
      error: (err) => {
       // alert(`Erreur lors de l'ajout: ${err.error.message || err.message}`);
       console.error('Erreur détaillée:', err);
       if (err.error) {
         console.error('Corps de l\'erreur:', err.error);
       }
       alert(`Erreur lors de l'ajout: ${err.error?.message || err.message}`);
     }
      
    });
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
        // console.log(this.prod);
          this.produitForm = this.formBuilder.group({
               imageUrl:[this.prod.imageUrl],
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

  // Start champ surplus
  addInput() {
    this.inputs.push(this.createInput());
  }
  createInput(): FormGroup {
    return this.formBuilder.group({
<<<<<<< HEAD
      price: [0],
      name:['']
=======
      price: [null],
      name: ['']
>>>>>>> mon-travail-local
    });
  }
  removeInput(index: number) {
  if (this.inputs.length > 1) { // Évite de supprimer tous les champs
    this.inputs.removeAt(index);
  }
}

// EnD champ surplus

}
