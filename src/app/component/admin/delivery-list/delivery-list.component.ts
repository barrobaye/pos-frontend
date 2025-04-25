import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {DeliveryManService} from '../../../services/deliveryMan/delivery-man.service';
import {DeliveryMan} from '../../../common/deliveryMan';
import {response} from 'express';

@Component({
  selector: 'app-delivery-list',
  standalone: true,
    imports: [
        DatePipe,
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        RouterLink
    ],
  templateUrl: './delivery-list.component.html',
  styleUrl: './delivery-list.component.scss'
})
export class DeliveryListComponent implements OnInit{

  deliveryMans!:any;
  deliveryForm!:FormGroup;
  constructor(private deliveryManService: DeliveryManService,private formBuilder:FormBuilder) {
    this.deliveryForm = this.formBuilder.group({
      fullName:[],
      code:[],
      telephone:[]
    })
  }

  seeAdd = false;
  seeUp = false;

  showAdd(){
    this.seeAdd = true;
  }
  closeAd(){
    this.seeAdd = false;
    this.updateView = false;

  }
  ngOnInit() {
    this.deliveryManService.listDeliveryMan().subscribe(
      res=>{
        this.deliveryMans = res;
        // console.log(res);
      }
    )
  }

  fullName!:string;
  code!:string;
  telephone!:string;
  updateView = false;

  deliveryMan!:DeliveryMan;
  viewDelivery(id:any, b: boolean) {

    if(b === true){
      this.deliveryManService.getDeliveryManById(id).subscribe(
        res=>{
          this.fullName = res.fullName;
          this.code = res.code;
          this.telephone = res.telephone;
          this.deliveryForm = this.formBuilder.group({
            fullName :[this.fullName],
            code:[this.code],
            telephone:[this.telephone]
          })
        }
      )
      this.seeAdd = true;
    }
    else {
      this.updateView = true;
      this.deliveryManService.getDeliveryManById(id).subscribe(
        res=>{
          this.deliveryMans = res;
          this.fullName = res.fullName;
          this.code = res.code;
          this.telephone = res.telephone;
          console.log(res);
        }
      )
    }
  }

  deleteDelivery(id:any) {

    if(confirm("Voulez-vous vraiment supprimer ce livreur")){
      this.deliveryManService.deleteDeliveryMane(id).subscribe(
        {
          next:response=>{
            alert("Livreur supprimer avec succes")
            window.location.reload();
          },
          error:err => {
            alert("Quelque chose n'a pas marche...:)");
          }
        }
      )
    }
  }
}
