import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ProductService} from '../../services/product/product.service';
import {ProductCategory} from '../../common/product-category';
import {Surplus} from '../../common/surplus';
import {Product} from '../../common/product';
import {CartItem} from '../../common/cart-item';
import {CartService} from '../../services/cart/cart.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {CheckoutService} from '../../services/checkout/checkout.service';
import {Order} from '../../common/order';
import {Customer} from '../../common/customer';
import {OrderItem} from '../../common/order-item';
import {OrderSurplus} from '../../common/orderSurplus';
import {Purchase} from '../../common/purchase';
import {response} from 'express';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-home4',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    QRCodeModule
  ],
  templateUrl: './home4.component.html',
  styleUrl: './home4.component.scss'
})
export class Home4Component implements OnInit{

  checkoutFormGroup:FormGroup;
  constructor(private produitService:ProductService,private cartService:CartService,private formBuilder: FormBuilder,private router: Router,
              private checkoutService:CheckoutService) {
    this.checkoutFormGroup = this.formBuilder.group({
      // customer:this.formBuilder.group({
      //   numTel:['']
      // })
    })

  }

  ngOnInit() {
    this.listProducts();
    this.listCategory();
    this.updateCartStatus();
    this.listCartDetails();
  }

  chooseCh = true;
  hoveredProduct: any = null; // Pour gérer le survol
  selectedProduct: any = null;
  showSuplean = false;

  selectedOption: string = '';
  selectOption(option: string) {
    this.selectedOption = option; // Met à jour l'option sélectionnée
    console.log(`Option sélectionnée : ${this.selectedOption}`);
    this.chooseCh = false;
    // Affiche l'option dans la console
    // Ajoutez ici d'autres logiques si nécessaire
  }

  product:any[] = [];
  selectedCategory: any;
  totalProducts = 0;

  listProducts():void {
    this.produitService.getProducts().subscribe(
      res=>{
        this.product = res;
        // this.applyFilter();
        this.filteredProducts = res;
        this.totalProducts = res.length;
        console.log(this.product);
      }

    )
  }

  filteredProducts: any[] = [];
  titleHeader = "Tous les produits";
  selectCategory(category: any): void {
    this.selectedCategory = category;
    console.log(category)
    this.titleHeader = category.categoryName;
    // Filtrer les produits par catégorie
    this.filteredProducts = this.product.filter(product => product.categoryDTO.id === category.id); // Assurez-vous que 'categoryId' et 'id' correspondent à votre modèle
  }
  resetFilter(): void {
    this.titleHeader = "Tous les produits"
    this.filteredProducts = this.product; // Réinitialiser à tous les produits
    this.selectedCategory = null; // Réinitialiser la catégorie sélectionnée
  }


  totalP=0;
  productId = 0;
  productSup!:any;
  openProd(id:number){
    this.produitService.getProductById(id).subscribe(
      res=>{
        this.productSup =res;
        this.totalP = res.length;

        console.log(this.productSup);
      }
    )
  }

  quantite = 1;
  productCategory :ProductCategory[] = [];
  listCategory(){
    this.produitService.getCategories().subscribe(
      data=>{
        this.productCategory = data;
        console.log(this.productCategory);
      }
    )
  }


  totalPrice: number = 0;
  totalQuantity: number = 0;
  cartItems: CartItem[] = [];

  private updateCartStatus() {

    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice=data
    );

    //subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity=data
    );
  }

  listCartDetails() {

    // get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // compute cart total price and quantity
    this.cartService.computeCartTotals();
  }

  closeSuplean(){
    this.showSuplean = false;
    // this.productSup = [];
    this.quantite = 1;
    // this.ortherProd = [] ;
    this.cartService.removeAllCartItems();
    this.currentCategoryIndex=0;
    this.currentCategory = '';
    window.location.reload();

  }
  openSuplean(id:number){
    this.showSuplean = true;
    this.produitService.getProductById(id).subscribe(
      res=>{
        this.productSup =res;
        this.productId = res.id;
        console.log(this.productId);
      }
    )
    // this.produitService.listSuplean(id).subscribe(
    //   res=>{
    //     this.supleant = res;
    //     console.log(this.supleant)
    //   }
    // )
  }
  ortherProd: any[] = [];
  totalOrder: number = 0;
  currentCategory: string = '';
  selectedProducts: any[] = []; // Tableau pour stocker les produits sélectionnés
  currentCategoryIndex: number = 0; // Pour suivre la catégorie actuelle

  categories: string[] = ['Burger', 'Pizza', 'Suppleant', 'Sauces', 'Dessert', 'cofee', 'Boissons'];

  nextProd(category: string, quantity: number, product: any) {
    console.log(category);
    this.currentCategory = category;

    // Ajoutez le produit et la quantité au panier avant de changer de catégorie
    // if (product) {
    //   this.addToCart(product, quantity);
    // }
    // if(this.currentCategoryIndex ){
    //
    // }
    switch (category) {
      case 'Burger':
      case 'Pizza':
        this.produitService.listProdCt('Suppleant').subscribe({
          next: (response) => {
            this.ortherProd = response;
            this.totalOrder = this.ortherProd.length;
            this.currentCategoryIndex = 1; // Mettre à jour l'index de catégorie
          },
          error: (err) => {
            alert('Quelque chose ne s\'est pas bien passé');
          },
        });
        break;
      case 'Suppleant':
        this.produitService.listProdCt('Sauces').subscribe({
          next: (response) => {
            this.ortherProd = response;
            this.totalOrder = this.ortherProd.length;
            this.currentCategoryIndex = 2; // Mettre à jour l'index de catégorie
          },
          error: (err) => {
            alert('Quelque chose ne s\'est pas bien passé');
          },
        });
        break;
      case 'Sauces':
        this.produitService.listProdCt('Dessert').subscribe({
          next: (response) => {
            this.ortherProd = response;
            this.totalOrder = this.ortherProd.length;
            this.currentCategoryIndex = 3; // Mettre à jour l'index de catégorie
          },
          error: (err) => {
            alert('Quelque chose ne s\'est pas bien passé');
          },
        });
        // this.produitService.listProdCt('Boissons').subscribe({
        //   next: (response) => {
        //     this.ortherProd = response;
        //     this.totalOrder = this.ortherProd.length;
        //     this.currentCategoryIndex = 4; // Mettre à jour l'index de catégorie
        //   },
        //   error: (err) => {
        //     alert('Quelque chose ne s\'est pas bien passé');
        //   },
        // });
        break;
      case 'Dessert':
      case 'cofee':
        this.produitService.listProdCt('Boissons').subscribe({
          next: (response) => {
            this.ortherProd = response;
            this.totalOrder = this.ortherProd.length;
            this.currentCategoryIndex = 4; // Mettre à jour l'index de catégorie
          },
          error: (err) => {
            alert('Quelque chose ne s\'est pas bien passé');
          },
        });
        break;
      default:
        console.warn('Unexpected category:', category);
        break;
    }
  }
  details = false;
  finalize() {
    // Envoyer tous les produits sélectionnés au panier
    this.selectedProducts.forEach(item => {

      this.addToCart(item.product, item.quantity)
    });
    if(this.selectedProducts.length == 0) {
      this.addToCart(this.productSup,this.quantite);
    }
    // this.viewPa = true;
    this.showSuplean = false;
    this.quantite = 1;
    this.ortherProd = [];
    this.currentCategory = "";
    this.selectedProducts = [];
    this.totalOrder = 0;
    this.currentCategoryIndex = 0;
    this.openProd(this.productId);

    // alert('Produits ajoutés au panier!');
  }

  previousProd() {
    // Gérer le retour à la catégorie précédente
    if (this.currentCategoryIndex > 0) {
      this.currentCategoryIndex--;
      const previousCategory = this.categories[this.currentCategoryIndex];

      // Si vous avez un produit sélectionné, vous pouvez le passer
      const selectedProduct = this.ortherProd.length > 0 ? this.ortherProd[0] : null; // Choisissez le produit à passer
      this.nextProd(previousCategory, this.quantite, selectedProduct);
    }
  }



  ordersSup :Surplus[] =[];
  addToCart(theProduct: Product,quantit:number) {
    this.showSuplean = true;
    console.log(`adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    // console.log(cartItem.quantity)

    const cartItem = new CartItem(theProduct);
    // cartItem.surplus = selectedSup;
    // this.qte = cartItem.quantity;
    cartItem.quantity = quantit;




    // this.prodCart = cartItem;
    this.cartItems = this.cartService.cartItems;


    console.log(this.cartItems);
    this.cartService.addToCart(cartItem);

    this.selectedProduct = theProduct;
    // this.ordersSup = selectedSup;
    // this.selectedSup = [];
    // this.quantite = 0;
    // this.showSuplean = false;

    // console.log(this.ordersSup);

  }
  isSelected(prod: any): boolean {
    return this.selectedProducts.some(item => item.product.id === prod.id);
  }

  onCheckBoxChange(event: any, prod: any) {
    const isChecked = event.target.checked;

    if (isChecked) {
      // Si la case est cochée, on ajoute le produit au panier
      this.addToCart1(prod);
      // Ajout du produit à selectedProducts si ce n'est pas déjà fait
      if (!this.selectedProducts.some(item => item.product.id === prod.id)) {
        this.selectedProducts.push({ product: prod });
      }
      console.log(this.selectedProducts);
    } else {
      // Si la case est décochée, on retire le produit du panier
      this.selectedProducts = this.selectedProducts.filter(item => item.product.id !== prod.id);
      this.cartService.remove(prod); // Retirer le produit du cartService
      console.log(`Removed from cart: ${prod.name}`);
    }
  }


  // viewPa = false;
  // showAd(){
  //   this.viewPa = true;
  // }
  // closeAd(){
  //   this.viewPa = false;
  // }

  addToCart1(theProduct: Product) {
    // console.log(`adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    // console.log(cartItem.quantity)

    const cartItem = new CartItem(theProduct);
    // cartItem.surplus = selectedSup;
    // this.qte = cartItem.quantity;
    cartItem.quantity = 0;

    // const existingProduct = this.selectedProducts.find(item => item.product.id === theProduct.id);
    //
    // if (existingProduct) {
    //   // Si le produit est déjà sélectionné, on le retire
    //   this.cartService.remove(existingProduct);
    //
    //   this.selectedProducts = this.selectedProducts.filter(item => item.product.id !== theProduct.id);
    //
    //   // Retirer le produit du panier
    //   this.cartItems = this.cartItems.filter(item => item.id !== theProduct.id);
    //
    //
    //   // this.cartService.(this.cartItems); // Mettez à jour le service de panier
    //
    //   // Ne pas affecter l'input si la quantité est 0
    //   if (existingProduct.quantity > 0) {
    //     this.updateInputQuantity(existingProduct.quantity); // Mettez à jour l'input uniquement si la quantité est > 0
    //   }
    //
    //   }
    //
    // else {
    //   // Sinon, on l'ajoute avec une quantité de 1 par défaut
    //   this.selectedProducts.push({ product: theProduct, quantity: 1 });
    //
    //   // Ajouter le produit au panier
    //   this.cartItems.push(cartItem);
    //   this.cartService.addToCart(cartItem); // Ajoutez le produit au service de panier
    //
    //   // Mettez à jour l'input avec la quantité
    //   this.updateInputQuantity(cartItem.quantity);
    //
    // }


    console.log(this.cartItems);
    this.cartService.addToCart(cartItem);

    this.selectedProduct = theProduct;
    // this.ordersSup = selectedSup;
    // this.selectedSup = [];
    // this.quantite = 0;
    // this.showSuplean = false;
    console.log(theProduct)
    // this.ortherProd = [];


  }
  updateInputQuantity(quantity: number) {
    // Assurez-vous que la quantité est valide avant de mettre à jour l'input
    if (quantity == 0) {
      this.quantite = 1;
      // this.quantite = quantity; // Mettez à jour la variable qui est liée à l'input
    }
  }
  remove(tempCartItem: CartItem) {
    this.cartService.remove(tempCartItem);
  }

  decrementQuantity() {
    if (this.quantite > 0) {
      this.quantite--;
    }

  }


  // incrementQuantity(tempCartItem: CartItem) {
  //   this.cartService.addToCart(tempCartItem,this.selectedSup);
  // }
  incrementQuantity() {
    if(this.quantite>=0){
      this.quantite++;
    }
    // this.cartService.addToCart(tempCartItem,this.selectedSup);
  }

  // get totalSupplementsPrice() {
  //   return this.selectedProducts.reduce((acc, prod) => acc + prod.unitPrice, 0); // Calculate total sup price
  // }
  get subTot(){
    return this.totalPrice * this.quantite;
  }

  annuler(){
    this.cartService.removeAllCartItems();
    this.totalP = 0;
    this.quantite = 1;
  }

  response = '';
  onSubmit(){
    console.log("Commande lancer avec succes");

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // let customerS = new Customer();
    // customerS.numTel = this.checkoutFormGroup.controls['customer'].value.numTel;

    const cartItems = this.cartService.cartItems;

    const orderItems: OrderItem[] = [];
    const orderSurpluses: OrderSurplus[] = []; // Assurez-vous que c'est le bon type

    for (let i = 0; i < cartItems.length; i++) {
      const orderItem = new OrderItem(cartItems[i]);
      orderItem.productsId = cartItems[i].id; // Assuming 'id' property exists in cartItem
      orderItem.price = cartItems[i].unitPrice; // Assuming 'unitPrice' property exists in cartItem
      orderItems.push(orderItem); // Add to the array

      const cartItem = cartItems[i];
      const surplusItems = cartItem.surplus || [];
      surplusItems.forEach(surplusItem => {
        const orderSurplus = new OrderSurplus();
        orderSurplus.surplus = surplusItem; // Supposons que l'ID est une propriété importante
        // Ajoutez d'autres propriétés de surplusItem si nécessaire :
        // orderSurplus.quantity = surplusItem.quantity;
        // orderSurplus.price = surplusItem.price;
        orderSurpluses.push(orderSurplus);
      });
    }

    let purchase = new Purchase();
    //purchase.customer = customerS.telephone ;
    purchase.order = order;
    purchase.order.moyen = 1;
    purchase.orderItems = orderItems;
    // purchase.customer = customerS;
    purchase.orderSurpluses = orderSurpluses;
    purchase.order.serviceType = this.selectedOption;

    console.log(purchase);
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        //success
        next: response => {
          // alert(`Votre commande ${response.orderTrackingNumber} est bien passe`)
          // this.viewPa = false;
          // this.showEnd = true;
          console.log(response.orderTrackingNumber);
          //reset cart

          this.response = response.orderTrackingNumber;
          // if(this.selectedValue == '2'){
          //   this.paymentService.sendPayment(purchase);
          // }
          this.resetCart();
          this.cartService.removeAllCartItems();
          this.details = true;
          // window.location.reload();
        },
        error: err => {
          alert(`There was an error: ${err.message}`)
        }

        //error
      }
    )

  }
  onSubmit1(){
    console.log("Commande lancer avec succes");

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // let customerS = new Customer();
    // customerS.numTel = this.checkoutFormGroup.controls['customer'].value.numTel;

    const cartItems = this.cartService.cartItems;

    const orderItems: OrderItem[] = [];
    const orderSurpluses: OrderSurplus[] = []; // Assurez-vous que c'est le bon type

    for (let i = 0; i < cartItems.length; i++) {
      const orderItem = new OrderItem(cartItems[i]);
      orderItem.productsId = cartItems[i].id; // Assuming 'id' property exists in cartItem
      orderItem.price = cartItems[i].unitPrice; // Assuming 'unitPrice' property exists in cartItem
      orderItems.push(orderItem); // Add to the array

      const cartItem = cartItems[i];
      const surplusItems = cartItem.surplus || [];
      surplusItems.forEach(surplusItem => {
        const orderSurplus = new OrderSurplus();
        orderSurplus.surplus = surplusItem; // Supposons que l'ID est une propriété importante
        // Ajoutez d'autres propriétés de surplusItem si nécessaire :
        // orderSurplus.quantity = surplusItem.quantity;
        // orderSurplus.price = surplusItem.price;
        orderSurpluses.push(orderSurplus);
      });
    }

    let purchase = new Purchase();
    //purchase.customer = customerS.telephone ;
    purchase.order = order;
    purchase.order.moyen = 0;
    purchase.orderItems = orderItems;
    // purchase.customer = customerS;
    purchase.orderSurpluses = orderSurpluses;
    purchase.order.serviceType = this.selectedOption;

    console.log(purchase);
    this.checkoutService.placeOrderOnLine(purchase).subscribe(
      {
        //success
        next: response => {

          // alert(`Votre commande ${response.orderTrackingNumber} est bien passe`)
         this.selectedProducts = [];
          console.log(response);
          //reset cart
          this.response = response.orderTrackingNumber;
          // if(this.selectedValue == '0'){
          //   this.paymentService.sendPayment(purchase);
          // }
          this.resetCart();
          this.cartService.removeAllCartItems();
          this.details = true;
        },
        error: err => {
          alert(`There was an error: ${err.message}`)
        }

        //error
      }
    )


  }

  private resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form
    this.checkoutFormGroup.reset();


    //navigate back to the products page

  }
  terminer() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form
    this.checkoutFormGroup.reset();


    //navigate back to the products page
    window.location.reload();
  }



}
