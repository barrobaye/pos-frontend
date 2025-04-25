import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product/product.service';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Product} from '../../common/product';
import {ProductCategory} from '../../common/product-category';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CartItem} from '../../common/cart-item';
import {CartService} from '../../services/cart/cart.service';
import {Order} from '../../common/order';
import {OrderItem} from '../../common/order-item';
import {Purchase} from '../../common/purchase';
import {CheckoutService} from '../../services/checkout/checkout.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Customer} from '../../common/customer';
import {Payment} from '../../services/payment/payment';
import {AdminService} from '../../services/auth/admin/admin.service';
import {Admin} from '../../common/admin';
import {Surplus} from '../../common/surplus';
import {OrderSurplus} from '../../common/orderSurplus';


@Component({
  selector: 'app-home-cli',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    NgOptimizedImage,
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './home-cli.component.html',
  styleUrl: './home-cli.component.scss'
})
export class HomeCliComponent  implements OnInit{

  product :any[] = [];
  productFilter:any[] =[];
  showCart:boolean = false;
  admin!:Admin;
  imgA!:any;
  showEnd = false;

  showT = false;
  selectTypeOrder = "";

  ngOnInit() {
    this.listProducts();
    this.listCategory();
    this.updateCartStatus();
    this.listCartDetails();

    this.showT = true;


    const idA = 1;

    this.adminService.getAdmin(idA).subscribe(
      data=>{
        this.admin = data;
        this.imgA = data.imgSite;
        console.log(this.admin.imgSite);
      }

    )



  }
  closeEnd(){
    this.showEnd = false;
    window.location.reload();
  }

  checkoutFormGroup: FormGroup;
  supleant!:any;
  selectedSup: Surplus[] = [];
  productSup!:any;
  showSuplean = false;
  quantite = 1;

  constructor(private produitService:ProductService,private cartService:CartService,private formBuilder: FormBuilder,private router: Router,
              private checkoutService:CheckoutService,private paymentService:Payment,
              private route:ActivatedRoute,private adminService:AdminService) {
    this.checkoutFormGroup = this.formBuilder.group({
      customer:this.formBuilder.group({
        numTel:['']
      })
    })
  }

  closeSuplean(){
    this.showSuplean = false;
    this.productSup = [];
    this.quantite = 1;
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

  viewDetailsCart(){
    this.showCart = true;
  }
  listProducts():void {
      this.produitService.getProducts().subscribe(
        products => {
          // console.log(products);
          this.product = products;
          this.applyFilter();
          console.log(this.productFilter);
        }
      )
  }

  productCate :Product[] = [];
  selectCategorie:string = "";
  applyFilter(){
    this.productFilter = this.product.filter(product =>{
      return (this.selectCategorie ===""|| this.selectCategorie === product.category.categoryName);
    })
    if(this.productFilter.length === 0){
      this.productFilter = this.product;

    }

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
  selectedProduct: any = null;
  ordersSup :Surplus[] =[];
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





  // decrementQuantity(tempCartItem: CartItem) {
  //
  //   this.cartService.decrementQuantity(tempCartItem);
  // }
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

  remove(tempCartItem: CartItem) {
    this.cartService.remove(tempCartItem);
  }
  // incrementQuantity(tempCartItem: CartItem) {
  //   // this.cartService.addToCart(tempCartItem);
  // }
  removeA(){
    this.cartService.removeAllCartItems();
  }

  selectedValue: string = '';
  activateLabel(value: string) {
    // Implement your logic here to activate the corresponding label
    // For example, you might update a variable to track the selected payment method
    this.selectedValue = value;
    this.selectTypeOrder = value;
    console.log('Label activated:', value);
  }


  espece:boolean = false;
  mobTransact = false;
  mob(){
    this.mobTransact = true;
  }

  especeOrder(){
    this.espece = true;
  }
  onSubmit1(){
    console.log("Commande lancer avec succes");

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    let customerS = new Customer();
    customerS.numTel = this.checkoutFormGroup.controls['customer'].value.numTel;

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
    purchase.customer = customerS;
    purchase.orderSurpluses = orderSurpluses;

    console.log(customerS.numTel);
    this.checkoutService.placeOrderOnLine(purchase).subscribe(
      {
        //success
        next: response => {

          // alert(`Votre commande ${response.orderTrackingNumber} est bien passe`)
          this.viewPa = false;
          this.showEnd = true;
          console.log(purchase);
          //reset cart

          // if(this.selectedValue == '0'){
          //   this.paymentService.sendPayment(purchase);
          // }
          this.resetCart();
          this.cartService.removeAllCartItems();
          // window.location.reload();
        },
        error: err => {
          alert(`There was an error: ${err.message}`)
        }

        //error
      }
    )
  }
  onSubmit(){
    console.log("Commande lancer avec succes");

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    let customerS = new Customer();
    customerS.numTel = this.checkoutFormGroup.controls['customer'].value.numTel;

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
    purchase.customer = customerS;
    purchase.orderSurpluses = orderSurpluses;

    console.log(customerS.numTel);
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        //success
        next: response => {
          // alert(`Votre commande ${response.orderTrackingNumber} est bien passe`)
          this.viewPa = false;
          this.showEnd = true;
          console.log(purchase);
          //reset cart

          // if(this.selectedValue == '2'){
          //   this.paymentService.sendPayment(purchase);
          // }
          this.resetCart();
          this.cartService.removeAllCartItems();
          // window.location.reload();
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
    this.router.navigateByUrl("/home")
  }

  viewPa = false;
  showAd(){
    this.viewPa = true;
  }
  closeAd(){
    this.viewPa = false;
  }

  selectedValue2 = "";


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

  typeOrder !:any ;
  chooseType(){
    if(this.selectTypeOrder == '0'){
      // this.typeOrder = TypeOrder.Emporter;
      this.showT = false;
    }
    if(this.selectTypeOrder == '1'){
      // this.typeOrder = TypeOrder.Surplace;
      this.showT = false;
    }
  }
}
