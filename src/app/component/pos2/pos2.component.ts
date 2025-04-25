import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CaisseService} from '../../services/auth/caisse/caisse.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Subscription, switchMap, timer} from 'rxjs';
import {OrderService} from '../../services/order/order.service';
import {ProductCategory} from '../../common/product-category';
import {ProductService} from '../../services/product/product.service';
import {CartService} from '../../services/cart/cart.service';
import {Product} from '../../common/product';
import {CartItem} from '../../common/cart-item';
import {Surplus} from '../../common/surplus';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Order} from '../../common/order';
import {Caissier} from '../../common/caissier';
import {OrderItem} from '../../common/order-item';
import {OrderSurplus} from '../../common/orderSurplus';
import {Purchase} from '../../common/purchase';
import {CheckoutService} from '../../services/checkout/checkout.service';

@Component({
  selector: 'app-pos2',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './pos2.component.html',
  styleUrl: './pos2.component.scss'
})
export class Pos2Component implements OnInit{

  ordersEnCours:any;
  public subscription = new Subscription();
  enCours = false;
  product !:any[];
  hoveredProduct: any = null; // Pour gérer le survol
  selectedProduct: any = null;
  selectCategoryId:any;
  selectedCategory: any;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  cartItems: CartItem[] = [];
  checkoutFormGroup: FormGroup;
  loginL="";
  loginS = "";
  log1 = '';

  constructor(private caissierService:CaisseService,private route:Router,private orderService:OrderService,
              private produitService:ProductService,private cartService:CartService,private formBuilder:FormBuilder,
              private activeRoute:ActivatedRoute,private checkoutService:CheckoutService) {

    this.loginL = this.activeRoute.snapshot.params['login'];
    this.loginS = this.caissierService.getLoginV();
    console.log(this.loginL);

    this.checkoutFormGroup = formBuilder.group({


      caissier : this.formBuilder.group({
        login:this.loginL ? this.loginL : this.loginS,
        fullName:['']
      })

    })
  }


  logOut(){
    this.caissierService.signOutCaissier();
    this.route.navigate(['caissier/connexion']);
  }

  productCategory :ProductCategory[] = [];
  listCategory(){
    this.produitService.getCategories().subscribe(
      data=>{
        this.productCategory = data;
        console.log(this.productCategory);
      }
    )
  }
  totalProducts = 0;
  listProducts():void {
    this.produitService.getProducts().subscribe(
      res=>{
        this.product = res;
        this.filteredProducts = res;
        this.totalProducts = res.length;
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
  ngOnInit() {
    // this.subscription.add(timer(0,1000).pipe(
    //   switchMap(()=> this.orderService.listOEnCours()),
    // ).subscribe(
    //   (orders)=>{
    //     this.ordersEnCours = orders;
    //     console.log(this.ordersEnCours);
    //   }
    // ))
    this.listProducts();
    this.listCategory();
    this.listCartDetails();
    this.updateCartStatus();

    this.orderService.listOEnCours().subscribe(
      res=>{
        this.ordersEnCours = res;
      }
    )

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

  showEnCours(){
    this.enCours = true;

  }
  closeEnCours(){
    this.enCours = false;
  }
  updateOrders(id:any){

    let formData = new FormData();
    formData.append('orderId', id);
    formData.append('loginCaissier',this.caissierService.getLoginV());

    this.orderService.updateOrderCaissier(formData).subscribe(
      {
        next:response=>{
          alert(`Commande lancer avec succes ...`);
          this.closeEnCours();
        },
        error:err=>{
          alert(`There was an error: ${err.message}`)
        }
      }
    )

  }

  quantite:number = 1;
  showSuplean =  false;
  ortherProd: any[] = [];
  totalOrder: number = 0;
  currentCategory: string = '';
  selectedProducts: any[] = []; // Tableau pour stocker les produits sélectionnés
  currentCategoryIndex: number = 0;
  totalP=0;
  productId = 0;
  productSup!:any;
  espece:boolean = false;

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
  openProd(id:number){
    this.produitService.getProductById(id).subscribe(
      res=>{
        this.productSup =res;
        this.totalP = res.length;

        console.log(this.productSup);
      }
    )
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

  get subTot(){
    return this.totalPrice * this.quantite;
  }

  selectedValue2 = "";
  activateLabel2(value: string) {
    // Implement your logic here to activate the corresponding label
    // For example, you might update a variable to track the selected payment method
    this.selectedValue2 = value;
    console.log('Label activated:', value);
  }
  selectedValue: string = '';
  activateLabel(value: string) {
    // Implement your logic here to activate the corresponding label
    // For example, you might update a variable to track the selected payment method
    this.selectedValue = value;
    console.log('Label activated:', value);
  }

  removeA(){
    this.cartService.removeAllCartItems();
  }
  remove(tempCartItem: CartItem) {
    this.cartService.remove(tempCartItem);
  }

  onSubmit1(){
    console.log("Commande lancer avec succes");

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // let customerS = new Customer();
    // customerS.telephone = this.checkoutFormGroup.controls['customer'].value.telephone;

    let caissier = new Caissier();
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
    if(this.selectedValue2 === '0') {
      let purchase = new Purchase();
      console.log(purchase);
      // purchase.customer = customerS.telephone ;
      purchase.order = order;
      purchase.orderItems = orderItems;
      purchase.orderSurpluses = orderSurpluses;
      purchase.caissier = this.checkoutFormGroup.controls['caissier'].value;
      purchase.order.delivery = 0;

      // purchase.customer = customerS;
      // console.log(this.log);
      // console.log(customerS.telephone);
      this.checkoutService.placeOrder(purchase).subscribe(
        {
          //success
          next: response => {
            // alert(`Your order has been received. Order tracking number: ${response.orderTrackingNumber}`)
            console.log(purchase);
            //reset cart
            this.resetCart();
            this.cartService.removeAllCartItems();
            this.log1 = this.caissierService.getLoginV();
            console.log(this.log1);
            this.selectedValue2 = "";
            this.selectedValue = " ";
            // this.showEnd = true;
          },
          error: err => {
            alert(`There was an error: ${err.message}`)
          }

          //error
        }
      )
    }
    if(this.selectedValue2 === '2') {
      let purchase = new Purchase();
      console.log(purchase);
      // purchase.customer = customerS.telephone ;
      purchase.order = order;
      purchase.orderItems = orderItems;
      purchase.caissier = this.checkoutFormGroup.controls['caissier'].value;
      purchase.order.delivery = 1;

      // purchase.customer = customerS;
      // console.log(this.log);
      // console.log(customerS.telephone);
      this.checkoutService.placeOrder(purchase).subscribe(
        {
          //success
          next: response => {
            // alert(`Your order has been received. Order tracking number: ${response.orderTrackingNumber}`)
            console.log(purchase);
            //reset cart
            this.resetCart();
            this.cartService.removeAllCartItems();
            this.log1 = this.caissierService.getLoginV();
            // console.log(this.log1);
            this.selectedValue2 = "";
            this.selectedValue = " ";
            // this.showEnd = true;
          },
          error: err => {
            alert(`There was an error: ${err.message}`)
          }

          //error
        }
      )
    }

  }

  onSubmit2(){
    console.log("Commande lancer avec succes");

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // let customerS = new Customer();
    // customerS.telephone = this.checkoutFormGroup.controls['customer'].value.telephone;

    let caissier = new Caissier();
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

    // const selectedSupplements = this.ordersSup;
    // console.log(selectedSupplements)// Récupérer les suppléments sélectionnés
    // // for (let i = 0; i < cartItems.length; i++) {
    //
    //   const saveSup = new OrderSurplus();
    //   saveSup.surplus = cartItems[i].surplus;
    //   saveSup.surplus = selectedSupplements[i]; // Attribuer le nom du supplément
    //   orderSurpluses.push(saveSup); // Ajouter à l'array
    // }

    if(this.selectedValue2 === '0'){
      let purchase = new Purchase();
      console.log(purchase);
      // purchase.customer = customerS.telephone ;
      purchase.order = order;
      purchase.orderItems = orderItems;
      purchase.caissier = this.checkoutFormGroup.controls['caissier'].value;
      purchase.order.delivery = 0;
      purchase.orderSurpluses = orderSurpluses;
      // purchase.customer = customerS;
      // console.log(this.log);
      // console.log(customerS.telephone);
      this.checkoutService.placeOrderOnLine(purchase).subscribe(
        {
          //success
          next: response => {
            // alert(`Your order has been received. Order tracking number: ${response.orderTrackingNumber}`)
            console.log(purchase);
            //reset cart
            this.resetCart();
            this.cartService.removeAllCartItems();
            this.caissierService.setLoginV(this.loginS);
            this.log1 = this.caissierService.getLoginV();
            this.selectedValue2 = "";
            this.selectedValue = " ";
            console.log(this.log1);
            // this.showEnd = true;
          },
          error: err => {
            alert(`There was an error: ${err.message}`)
          }

          //error
        }
      )
    }
    if(this.selectedValue2 === '2'){
      let purchase = new Purchase();
      console.log(purchase);
      // purchase.customer = customerS.telephone ;
      purchase.order = order;
      purchase.orderItems = orderItems;
      purchase.caissier = this.checkoutFormGroup.controls['caissier'].value;
      purchase.order.delivery = 1;
      purchase.orderSurpluses = orderSurpluses;
      // purchase.customer = customerS;
      // console.log(this.log);
      // console.log(customerS.telephone);
      this.checkoutService.placeOrderOnLine(purchase).subscribe(
        {
          //success
          next: response => {
            // alert(`Your order has been received. Order tracking number: ${response.orderTrackingNumber}`)
            console.log(purchase);
            //reset cart
            this.resetCart();
            this.cartService.removeAllCartItems();
            this.caissierService.setLoginV(this.loginS);
            this.log1 = this.caissierService.getLoginV();
            this.selectedValue2 = "";
            this.selectedValue = " ";
            console.log(this.log1);
            // this.showEnd = true;
          },
          error: err => {
            alert(`There was an error: ${err.message}`)
          }

          //error
        }
      )
    }
  }



  private resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form
    // this.checkoutFormGroup.controls['order'].reset();
    // this.checkoutFormGroup.controls['orderItem'].reset();

    const caissierValue = this.checkoutFormGroup.controls['caissier'].value;

    // Réinitialiser le formulaire
    this.checkoutFormGroup.reset();

    // Restaurer la valeur de 'caissier'
    // this.checkoutFormGroup.controls['caissier'].setValue(caissierValue);

    this.selectedValue = '';
    //navigate back to the products page
    // this.router.navigateByUrl("/home")
  }


}
