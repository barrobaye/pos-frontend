import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import {RouterLink} from "@angular/router";
import {ProductService} from '../../../services/product/product.service';
import {CommonModule, DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CategoryService} from '../../../services/category/category.service';
import {AdminService} from '../../../services/auth/admin/admin.service';
import { ApiUrlService } from '../../../core/api-url.service';
import { ElementRef } from '@angular/core';



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
  //selectedImage: string | null = null;



  ngOnInit() {
    this.listProduits();
    this.listCategory();
  }

  get viewFields() {
    return [
      { label: 'Nom', value: this.prod?.name },
      { label: 'Diminutif', value: this.prod?.sku },
      { label: 'Description', value: this.prod?.description },
      { label: 'Prix', value: this.prod?.unitPrice },
      { label: 'Stock', value: this.prod?.unitsInStock },
      { label: 'Catégorie', value: this.prod?.categoryDTO?.categoryName },
    ];
  }

  categories!:any;
  listCategory(){
    this.categoryService.listCategory().subscribe(
      res=>{
        this.categories = res;
       // console.log(this.categories); 
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
              private formBuilder:FormBuilder,
              private categoryService:CategoryService,
              private authService:AdminService,
              public apiUrlService: ApiUrlService)  {
                this.modalMode = 'add';

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


/*   onFileSelected(event: Event) {
    const fileInput:any  = event.target as HTMLInputElement;
    if (fileInput.files.length > 0) {
      this.imageCategory = fileInput.files[0];

    }
  } */
  imageProduit!: File;
  
/*   onFileSelected1(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
  
    if (fileInput.files && fileInput.files.length > 0) {
      this.imageProduit = fileInput.files[0];
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result; // Mise à jour de l'aperçu de l'image
      };
      reader.readAsDataURL(this.imageProduit);
    }
  } */
// Gestion de la sélection de fichier
onFileSelected1(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    this.currentImageFile = input.files[0];
    
    // Aperçu de la nouvelle image
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
    };
    reader.readAsDataURL(this.currentImageFile);
  }
}
 
//modal
modalMode: 'add'  | 'edit' |'view' = 'add';


  isEditMode = false;
  addView = false;
  addCategory = false;

  showEdit(prod: any) {
    this.modalMode = 'edit';
    this.prod = prod;
    this.isEditMode = true;
    this.addView = true;
  }

  showCategory(){
    this.addCategory = true;
  }
  closeCategory(){
    this.addCategory = false;
  }
  showAdd() {
    this.modalMode = 'add';
    this.addView = true;
  
    this.produitForm = this.formBuilder.group({
      name: [''],
      description: [''],
      sku: [''],
      unitPrice: [0],
      unitStock: [0],
      active: [true],
      categoryId: [''],
      image: [''],
      inputs: this.formBuilder.array([])  // si tu as des suppléments
    });
  }

  showUp(){
    this.upView = true;
  } 

  closeModal(){
    this.addView = false;
   // this.upView = false;
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
  // Lors de la soumission du formulaire


  onSubmit() {
    if (this.produitForm.invalid) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }  
    const formData = new FormData();
    const formValue = this.produitForm.value;
    const adminLogin = (this.authService.getLoginA() || '1').replace('L', '');
    formData.append('admin', adminLogin);
   /*  const adminLogin = this.authService.getLoginA() || '1L';
  
    // Champs communs
    formData.append('admin', adminLogin); */
    formData.append('name', formValue['name']);
    formData.append('sku', formValue['sku']);
    formData.append('description', formValue['description']);
    formData.append('unitPrice', formValue['unitPrice']);
    formData.append('unitStock', formValue['unitStock']);
    formData.append('categoryId', formValue.categoryId);


     // Gestion différente de l'image selon le mode
     if (this.modalMode === 'edit') {
      // Mode UPDATE - l'image est optionnelle
      if (this.imageProduit) {
        formData.append('image', this.imageProduit, this.imageProduit.name);
      }
    } else {
      // Mode CREATE - l'image est obligatoire
      if (!this.imageProduit) {
        alert('Veuillez sélectionner une image');
        return;
      }
      formData.append('image', this.imageProduit, this.imageProduit.name);
    }
    // Dans onSubmit()
if (this.fileInput.nativeElement.files.length > 0) {
  formData.append('image', this.fileInput.nativeElement.files[0]);
} else if (this.modalMode === 'edit') {
  formData.append('existingImageUrl', this.prod.imageUrl);
}
  
   


    interface ProduitInput {
      name: string;
      price: number | null; // ou string si vous traitez le prix comme chaîne
    }
    
// 2. Typage explicite dans votre forEach
const inputs = formValue.inputs as ProduitInput[]; // Cast explicite
  
    // Gestion des surplus
  //  const inputs = formValue.inputs;
    if (inputs?.length > 0) {
      inputs.forEach((input: ProduitInput) => {
        if (input.name && input.price !== null && input.price !== undefined) {
          formData.append('surplusNames', input.name);
          formData.append('surplusPrices', input.price.toString());
        }
      });
    }
  
    // Debug
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
  
    // Envoi selon le mode
    if (this.modalMode === 'edit' && this.prod?.id) {
      this.produitService.updateProduct(this.prod.id, formData).subscribe({
        next: () => {
          alert(`Produit ${formValue['name']} modifié avec succès`);
          this.resetForm();
        },
        error: (err) => this.handleError(err, 'mise à jour')
      });
    } else {
      this.produitService.saveProduct(formData).subscribe({
        next: () => {
          alert(`Produit ${formValue['name']} ajouté avec succès`);
          this.resetForm();
        },
        error: (err) => this.handleError(err, 'ajout')
      });
    }
  }
//Methode Utilitaire de Add & update

  resetForm() {
    this.produitForm.reset();
    this.selectedImage = null;
    this.addView = false;
    this.listProduits(); // Recharger la liste des produits
  }

  private handleError(err: any, action: string) {
    console.error(`Erreur lors de ${action}`, err);
    let errorMsg = err.error?.message || err.message;
    
    // Amélioration du message d'erreur
    if (err.status === 400) {
      errorMsg = 'Données invalides : ' + (err.error?.errors?.join(', ') || errorMsg);
    }
    
    alert(`Erreur lors de ${action}: ${errorMsg}`);
  }
 // End Methode Utilitaire 

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
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedImage: string | null = '/assets/default-image.jpg';
  currentImageFile: File | null = null;
  prod!:any;
  updateProd = false;
  upView = false;
  name = "";
  viewProduit(id: any, update: boolean) {
    this.produitService.getProductById(id).subscribe(res => {
      this.prod = res;
      console.log(this.prod);
  
      // Mise à jour du mode de la modal
      this.modalMode = update ? 'edit' : 'view';
      this.addView = true;
  
      if (update) {
        // Pré-remplir le formulaire avec les données du produit
        this.produitForm = this.formBuilder.group({
          name: [res.name],
          description: [res.description],
          sku: [res.sku],
          unitPrice: [res.unitPrice],
          unitStock: [res.unitsInStock],
          active: [res.active ?? true],
          categoryId: [res.category?.id || ''],
         
          inputs: this.formBuilder.array([])  // initialiser vide, puis remplir
        });
  
        // Si des suppléments existent, on les injecte dans le FormArray
        if (res.surplusDTOList && res.surplusDTOList.length > 0) {
          const surplusArray = this.produitForm.get('inputs') as FormArray;
          res.surplusDTOList.forEach((sup: any) => {
            surplusArray.push(this.formBuilder.group({
              name: [sup.name],
              price: [sup.price]
            }));
          });
        }
  
        // Pour afficher l'image actuelle
        
       // Gestion de l'image
       this.selectedImage = res.imageUrl 
       ? this.getFullImageUrl(res.imageUrl) 
       : '/assets/default-image.jpg';
     
     // Réinitialiser l'input fichier
     if (this.fileInput) {
       this.fileInput.nativeElement.value = '';
     }
     this.currentImageFile = null;
   }
 });
  }

// Méthode pour obtenir l'URL complète
private getFullImageUrl(imagePath: string): string {
  if (!imagePath) return '/assets/default-image.jpg';
  
  // Si c'est déjà une URL complète
  if (imagePath.startsWith('http')) return imagePath;
  
  // Si c'est un chemin relatif commençant par /static/
  if (imagePath.startsWith('/static/')) {
    // Solution 1: Si vos images sont servies par le backend
    return `${this.apiUrlService.getBaseUrl()}${imagePath}`;
    
    // OU Solution 2: Si les images sont dans les assets Angular
    // return imagePath.replace('/static/', '/assets/');
  }
  
  return imagePath;
}

  // Start champ surplus
  addInput() {
    this.inputs.push(this.createInput());
  }
  createInput(): FormGroup {
    return this.formBuilder.group({
      price: [null],
      name: ['']
    });
  }
  removeInput(index: number) {
  if (this.inputs.length > 1) { // Évite de supprimer tous les champs
    this.inputs.removeAt(index);
  }
}

}
