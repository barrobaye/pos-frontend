import {Purchase} from '../../common/purchase';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Ou spécifiez un module
})
export class Payment{
  constructor() {
  }
  //
  // public sendPayment(p:Purchase){
  //   let paymentRequestUrl = "https://paytech.sn/api/payment/request-payment";
  //   let fetch = require('node-fetch');// http client
  //   let params = {
  //     item_name:"Valider votre commande",
  //     item_price:p.order?.totalPrice,
  //     currency:"XOF",
  //     ref_command:"HBZZYZVUZZZV",
  //     command_name:"Paiement de votre commande",
  //     env:"test",
  //     ipn_url:"https://domaine.com/ipn",
  //     success_url:"https://domaine.com/success",
  //     cancel_url:"https://domaine.com/cancel",
  //     custom_field:JSON.stringify({
  //       custom_fiel1:"value_1",
  //       custom_fiel2:"value_2",
  //     })
  //   };
  //
  //   let headers = {
  //     Accept: "application/json",
  //     'Content-Type': "application/json",
  //     API_KEY:"b86b547e734862fcf879588b54bde40607911f19b3f68ab073528f7d47bca664",
  //     API_SECRET:"2461339029f2534ae2820e0b3773e2fd860b0d60dcc4d29e105564f8ccd78518",
  //   };
  //
  //   fetch(paymentRequestUrl, {
  //     method:'POST',
  //     body:JSON.stringify(params),
  //     headers: headers
  //   })
  //     .then((response: Response) => response.json()) // Specify the type of response
  //     .then((jsonResponse: any) => { // You can replace 'any' with a specific type if you have one
  //       console.log(jsonResponse);
  //     })
  //   ;
  // }
}
