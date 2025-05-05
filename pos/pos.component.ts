import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ProductService} from '../../services/product/product.service';
import {CartService} from '../../services/cart/cart.service';
import {Product} from '../../common/product';
import {ProductCategory} from '../../common/product-category';
import {CartItem} from '../../common/cart-item';
import {NgClass, NgForOf, NgIf, NgOptimizedImage, SlicePipe} from '@angular/common';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Order} from '../../common/order';
import {OrderItem} from '../../common/order-item';
import {Purchase} from '../../common/purchase';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {CaisseService} from '../../services/auth/caisse/caisse.service';
import {CheckoutService} from '../../services/checkout/checkout.service';
import {Customer} from '../../common/customer';
import {Caissier} from '../../common/caissier';
import {MenuPosComponent} from '../menu-pos/menu-pos.component';
import {interval, Subscription, switchMap, timer} from 'rxjs';
import {OrderService} from '../../services/order/order.service';
import {DeliveryManService} from '../../services/deliveryMan/delivery-man.service';
import {Surplus} from '../../common/surplus';
import {OrderSurplus} from '../../common/orderSurplus';


@Component({
  selector: 'app-pos',
  standalone: true,
  templateUrl: './pos.component.html',
  imports: [
    RouterLink,
    NgForOf,
    NgOptimizedImage,
    NgIf,
    ReactiveFormsModule,
    MatButton,
    NgClass,
    MenuPosComponent,
    SlicePipe,
    FormsModule
  ],
  styleUrl: './pos.component.scss'
})
export class PosComponent implements OnInit,OnDestroy{

  product !:any[];
  productFilter:Product[] =[];
  loginL="";
  loginS = "";
  supleant!:any;
  selectedSup: Surplus[] = [];
  constructor(private produitService:ProductService,
    private cartService:CartService,
    private formBuilder:FormBuilder,
              private caissierService:CaisseService,
              private checkoutService:CheckoutService,
              private orderService:OrderService,
              private activeRoute:ActivatedRoute,
              private route:Router) {
    // this.log = this.caissierService.getLoginV();
    // if(this.log){
    //   this.caissierService.setLoginIn(true);
    // }
    this.loginL = this.activeRoute.snapshot.params['login'];
    this.loginS = this.caissierService.getLoginV();
    console.log(this.loginL);
    this.caissierFormGroup = formBuilder.group({
      login:[],
      pwd:[]
    })

    this.checkoutFormGroup = formBuilder.group({
      caissier : this.formBuilder.group({
        login:this.loginL ? this.loginL : this.loginS,
        fullName:['']
      })

    })

  }

  showEnd = false;
  closeEnd(){
    this.showEnd = false;
    window.location.reload();
    
  }

  authC:boolean = true;
  caissierFormGroup!: FormGroup;
  public subscription = new Subscription();
  ordersEnCours:any;

  enCours = false;

  log1 = '';
  showSuplean = false;

  imageProduit!:any;
  products!:any;
  productSup!:any;


  closeSuplean(){
    this.showSuplean = false;
    this.productSup = [];
    this.quantite = 0;
  }
  ngOnInit() {
    this.listProducts();
    this.listCategory();
    this.updateCartStatus();
    // this.authC;
    // this.checkoutFormGroup;
     this.log1 = this.caissierService.getLoginV();
    // console.log(this.log);
    console.log(this.log1);

    this.subscription.add(timer(0,1000).pipe(
      switchMap(()=> this.orderService.listOEnCours()),
    ).subscribe(
      (orders)=>{
        this.ordersEnCours = orders;
        //console.log(this.ordersEnCours);
      }
    ))
  }

  selectCategoryId:any;
  // applyFilter(){
  //   this.productFilter = this.product.filter(product => {
  //     const categoryId = product.category.id;
  //     return (this.selectCategoryId === "" || categoryId === this.selectCategoryId);
  //   });
  //
  //   // Si aucun produit ne correspond, vous pouvez choisir de vider le filtre ou de laisser le tableau vide
  //   if (this.product.length === 0) {
  //     this.productFilter = [];
  //   }
  //
  //
  // }


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
          window.location.href = 'http://localhost:4200/cuisine'; // recharge complètement /cuisine
        },
        error:err=>{
          alert(`There was an error: ${err.message}`)
        }
      }
    )
  }
  openSuplean(id:number){
    this.showSuplean = true;
    this.produitService.getProductById(id).subscribe(
      res=>{
        this.productSup =res;

        console.log(this.productSup);
      }
    )
    this.produitService.listSuplean(id).subscribe(
      res=>{
        this.supleant = res;
        console.log(this.supleant)
      }
    )
  }



  img = 'assets/feane/images/f1.png';
  checkoutFormGroup: FormGroup;

  // onClose(): void {
  //   this.authC = false;
  // }
  login ='';
  onSubmit(){
    this.login = this.caissierFormGroup.controls['login'].value;

    this.caissierService.loginV(this.login).subscribe(res=>{
      this.caissierService.setLoginIn(true);
      this.caissierService.setLoginV(this.login);
      this.authC = false;
      // this.log1 = this.caissierService.getLoginV();

    })

  }


  listProducts():void {
    this.produitService.getProducts().subscribe(
      res=>{
        this.product = res;
        // this.applyFilter();
        console.log(this.product);
        this.filteredProducts = res;
        console.log(this.product);
      }
    )
  }
  selectedCategory: any;
  filteredProducts: any[] = [];
  titleHeader = "Tous les produits";
  selectCategory(category: any): void {
    this.selectedCategory = category;
  //  console.log(category)
    this.titleHeader = category.categoryName;
    // Filtrer les produits par catégorie
    this.filteredProducts = this.product.filter(product => product.categoryId === category.id); // Assurez-vous que 'categoryId' et 'id' correspondent à votre modèle
  }
  resetFilter(): void {
    this.titleHeader = "Tous les produits"
    this.filteredProducts = this.product; // Réinitialiser à tous les produits
    this.selectedCategory = null; // Réinitialiser la catégorie sélectionnée
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

  qte : number = 0;
  cartItems: CartItem[] = [];
  ordersSup :Surplus[] =[];

  quantite:number =0;

  addToCart(theProduct: Product,selectedSup: any[],quantit:number) {
    console.log(`adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    // console.log(cartItem.quantity)

    const cartItem = new CartItem(theProduct);
    cartItem.surplus = selectedSup;
    // this.qte = cartItem.quantity;
    cartItem.quantity = quantit;




    // this.prodCart = cartItem;
    this.cartItems = this.cartService.cartItems;


    console.log(this.cartItems);
    // this.cartService.addToCart(cartItem,this.selectedSup);

    this.selectedProduct = theProduct;
    this.ordersSup = selectedSup;
    this.selectedSup = [];
    this.quantite = 0;
    this.showSuplean = false;

    console.log(this.ordersSup);

  }

  // protected readonly caches = caches;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  private updateCartStatus() {

    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice=data
    );

    //subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity=data
    );

    // this.caissierService.getLoginV().subscribe(
    //   data => this.log
    // )
  }

  // decrementQuantity(tempCartItem: CartItem) {
  //
  //   this.cartService.decrementQuantity(tempCartItem);
  // }
  decrementQuantity() {
    if (this.quantite > 0) {
      this.quantite--;
    }

  }

  remove(tempCartItem: CartItem) {
    this.cartService.remove(tempCartItem);
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
  removeA(){
    this.cartService.removeAllCartItems();
  }

  selectedValue: string = '';
  activateLabel(value: string) {
    // Implement your logic here to activate the corresponding label
    // For example, you might update a variable to track the selected payment method
    this.selectedValue = value;
    console.log('Label activated:', value);
  }

  espece:boolean = false;

  mobTransact = false;
  mob(){
    this.mobTransact = true;
  }

  hoveredProduct: any = null; // Pour gérer le survol
  selectedProduct: any = null;

  especeOrder(){
    this.espece = true;
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
            this.showEnd = true;
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
            console.log(this.log1);
            this.selectedValue2 = "";
            this.selectedValue = " ";
            this.showEnd = true;
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
          this.showEnd = true;
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
            this.showEnd = true;
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logOut(){
    this.caissierService.signOutCaissier();
    this.route.navigate(['caissier/connexion']);
  }

  selectedValue2 = "";
  activateLabel2(value: string) {
    // Implement your logic here to activate the corresponding label
    // For example, you might update a variable to track the selected payment method
    this.selectedValue2 = value;
    console.log('Label activated:', value);
  }

  onCheckBoxChange(event: any, sup: any){
    const isChecked = event.target.checked;
    const supId = event.target.value.id; // Access the id property from the passed sup object

    if (isChecked) {
      // this.selectedSup.push(event.target.value);
      this.selectedSup.push({ id: sup.id, name: sup.name, priceS: sup.priceS });
      console.log(this.selectedSup);
    } else {
      // const supIndex = this.selectedSup.findIndex(sup => sup.id === supId);
      // if (supIndex !== -1) {
      //   this.selectedSup.splice(supIndex, 1); // Remove the sup object from selectedSup
      // }
      this.selectedSup = this.selectedSup.filter(item => item.id !== sup.id);
    }
  }
  get totalSupplementsPrice() {
    return this.selectedSup.reduce((acc, sup) => acc + sup.priceS, 0); // Calculate total sup price
  }

  get subTot(){
    return (this.productSup.unitPrice + this.totalSupplementsPrice) * this.quantite;
  }

}
