import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ProductCategory} from '../../common/product-category';
import {ProductService} from '../../services/product/product.service';
import {Product} from '../../common/product';
import {CartItem} from '../../common/cart-item';
import {CartService} from '../../services/cart/cart.service';
import {Order} from '../../common/order';
import {Customer} from '../../common/customer';
import {OrderItem} from '../../common/order-item';
import {OrderSurplus} from '../../common/orderSurplus';
import {Purchase} from '../../common/purchase';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CheckoutService} from '../../services/checkout/checkout.service';

@Component({
  selector: 'app-home3',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './home3.component.html',
  styleUrl: './home3.component.scss'
})
export class Home3Component implements OnInit{

  ngOnInit() {
    this.listCategory();
    this.listProducts();
    this.updateCartStatus();
    this.listCartDetails();

  }

  chooseCh = true;
  chooseT = false;
  goMenu(){
    this.chooseT = false;
    this.chooseCh = false;
  }

  tableSelected = "";
  selectTable(){
      this.chooseT = true;

  }
  tableS(table:string){
    this.tableSelected = table;
    this.chooseCh = false;

  }

  checkoutFormGroup: FormGroup;
  constructor(private produitService:ProductService,private cartService:CartService,
              private formBuilder:FormBuilder,private router: Router,private checkoutService:CheckoutService) {
    this.checkoutFormGroup = this.formBuilder.group({
      // customer:this.formBuilder.group({
      //   numTel:['']
      // })
    })
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

  product:any[] = [];
  selectedCategory: any;

  listProducts():void {
    this.produitService.getProducts().subscribe(
      res=>{
        this.product = res;
        // this.applyFilter();
        this.filteredProducts = res;
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

  hoveredProduct: any = null; // Pour gérer le survol
  selectedProduct: any = null;

  supPrd:any[] =[];
  saucePrd:any[]=[];
  dessert:any[]=[];
  bois:any[]=[];
  totalSup = 0;


  nextProd(category:any){
    console.log(category);

    switch (category) {
      case 'Burger':
      case 'Pizza':
        this.produitService.listProdCt('Suppleant').subscribe({
          next: (response) => {
            this.supPrd = response;
            this.totalSup = this.supPrd.length;

          },
          error: (err) => {
            alert('Quelque chose ne s\'est pas bien passé');
          },
        });
        this.getDessert();
        this.getSauces();
        this.getBoissons();

        break;
      case 'Dessert':
      case 'cofee':
        this.getBoissons();
        break;
    }
  }

  totalBois = 0;
  getBoissons(){
    this.produitService.listProdCt('Boissons').subscribe({
      next: (response) => {
        this.bois = response;
        this.totalBois = this.bois.length;
        console.log(this.totalBois)

      },
      error: (err) => {
        alert('Quelque chose ne s\'est pas bien passé');
      },
    });
  }

  totalDes =0;
  getDessert(){
    this.produitService.listProdCt('Dessert').subscribe({
      next: (response) => {
        this.dessert = response;
        this.totalDes = this.dessert.length;

      },
      error: (err) => {
        alert('Quelque chose ne s\'est pas bien passé');
      },
    });
  }
  totalSc = 0;
  getSauces(){
    this.produitService.listProdCt('Sauces').subscribe({
      next: (response) => {
        this.saucePrd = response;
        this.totalSc = this.saucePrd.length;

      },
      error: (err) => {
        alert('Quelque chose ne s\'est pas bien passé');
      },
    });
  }

  productSup!:any;
  totalP=0;
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
  incrementQuantity() {
    if(this.quantite>=0){
      this.quantite++;
    }
    // this.cartService.addToCart(tempCartItem,this.selectedSup);
  }

  totalPrice: number = 0;
  totalQuantity: number = 0;
  cartItems: CartItem[] = [];
  addToCart(theProduct: Product,quantit:number) {
    // this.showSuplean = true;
    console.log(`adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    console.log(quantit)

    const cartItem = new CartItem(theProduct);
    // cartItem.surplus = selectedSup;
    // this.qte = cartItem.quantity;
    // cartItem.quantity = quantit;

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

    console.log(theProduct);
    this.details = true;
  }
  private updateCartStatus() {

    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice=data
    );

    //subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity=data;
        this.quantite = data;
      }
    );
  }

  details = false;
  listCartDetails() {

    // get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
        // this.quantite = data;
      }

    );

    // compute cart total price and quantity
    this.cartService.computeCartTotals();


  }
  remove(tempCartItem: CartItem) {
    this.cartService.remove(tempCartItem);
  }


  annuler(){
    this.cartService.removeAllCartItems();
    this.totalP = 0;
    this.quantite = 1;
  }

  selectedProducts: any[] = [];
  // Assurez-vous que cartItems est initialisé

  isSelected(prod: any): boolean {
    return this.selectedProducts.some(item => item.product.id === prod.id);
  }

  addToCart1(theProduct: Product) {
    console.log(`Ajout au panier : ${theProduct.name}, ${theProduct.unitPrice}`);

    const cartItem = new CartItem(theProduct);
    cartItem.quantity = 0; // Initialisez la quantité

    const existingProduct = this.selectedProducts.find(item => item.product.id === theProduct.id);

    if (existingProduct) {
      // Si le produit est déjà sélectionné, on le retire
      this.remove(existingProduct);
      this.selectedProducts = this.selectedProducts.filter(item => item.product.id !== theProduct.id);

      // Retirer le produit du panier
      this.cartItems = this.cartItems.filter(item => item.id !== theProduct.id);
      // this.cartService.(this.cartItems); // Mettez à jour le service de panier

      // Ne pas affecter l'input si la quantité est 0
      if (existingProduct.quantity > 0) {
        this.updateInputQuantity(existingProduct.quantity); // Mettez à jour l'input uniquement si la quantité est > 0
      }
    } else {
      // Sinon, on l'ajoute avec une quantité de 1 par défaut
      this.selectedProducts.push({ product: theProduct, quantity: 1 });

      // Ajouter le produit au panier
      this.cartItems.push(cartItem);
      this.cartService.addToCart(cartItem); // Ajoutez le produit au service de panier

      // Mettez à jour l'input avec la quantité
      this.updateInputQuantity(cartItem.quantity);

    }

    this.selectedProduct = theProduct;
    console.log(this.cartItems);
  }

// Méthode pour mettre à jour l'input de quantité
  updateInputQuantity(quantity: number) {
    // Assurez-vous que la quantité est valide avant de mettre à jour l'input
    if (quantity == 0) {
      this.quantite = 1;
      // this.quantite = quantity; // Mettez à jour la variable qui est liée à l'input
    }
  }

  selectedOption: string = 'aEmporter'; // Valeur par défaut

  selectOption(option: string) {
    this.selectedOption = option; // Met à jour l'option sélectionnée
    console.log(`Option sélectionnée : ${this.selectedOption}`); // Affiche l'option dans la console
    // Ajoutez ici d'autres logiques si nécessaire
  }
  // updateInput(option: string) {
  //   this.selectedOption = option; // Met à jour l'option sélectionnée
  //   console.log(`Input mis à jour avec : ${this.selectedOption}`); // Affiche l'option dans la console
  // }

  selectedValue: string = '';
  activateLabel(value: string) {
    // Implement your logic here to activate the corresponding label
    // For example, you might update a variable to track the selected payment method
    this.selectedValue = value;

    // if(value == "0"){
    //   this.onSubmit();
    // }else if(value == "2"){
    //   this.onSubmit1();
    // }

    console.log('Label activated:', value);
  }

  get subTot(){
    return this.totalPrice  * this.quantite;
  }

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
    purchase.order.serviceType = this.selectedOption;
    if(this.selectedOption == "surPlace"){
      purchase.order.tableD = this.tableSelected;
    }
    purchase.orderSurpluses = orderSurpluses;


    console.log(purchase);
    console.log(this.selectedOption);
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        //success
        next: response => {
          // alert(`Votre commande ${response.id } est bien passe`)
          // this.viewPa = false;
          // this.showEnd = true;
          console.log(response);
          //reset cart

          // if(this.selectedValue == '2'){
          //   this.paymentService.sendPayment(purchase);
          // }
          // this.resetCart();
          this.viewDetails=true;
          // this.cartService.removeAllCartItems();
          // this.showEnd = true;
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
    purchase.order.serviceType = this.selectedOption;
    if(this.selectedOption == "surPlace"){
      purchase.order.tableD = this.tableSelected;
    }
    purchase.order.moyen = 0;
    purchase.orderItems = orderItems;
    // purchase.customer = customerS;
    purchase.orderSurpluses = orderSurpluses;


    console.log(purchase);
    console.log(this.selectedOption);
    this.checkoutService.placeOrderOnLine(purchase).subscribe(
      {
        //success
        next: response => {

          this.viewDetails=true;
          // alert(`Votre commande ${response.id} est bien passe`)
          // this.viewPa = false;
          // this.showEnd = true;
          console.log(response);
          //reset cart

          // if(this.selectedValue == '0'){
          //   this.paymentService.sendPayment(purchase);
          // }
          // this.resetCart();
          // this.cartService.removeAllCartItems();
          // window.location.reload();
        },
        error: err => {
          alert(`There was an error: ${err.message}`)
        }

        //error
      }
    )
  }

   resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form
    this.checkoutFormGroup.reset();
    this.cartService.removeAllCartItems();


    //navigate back to the products page
    //  window.location.reload();
  }

  viewDetails = false;




}
