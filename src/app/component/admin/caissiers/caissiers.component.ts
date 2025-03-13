import {Component, OnInit} from '@angular/core';
import {MenuComponent} from '../menu/menu.component';
import {RouterLink} from '@angular/router';
import {CaisseService} from '../../../services/auth/caisse/caisse.service';
import {Caissier} from '../../../common/caissier';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {response} from 'express';

@Component({
  selector: 'app-caissiers',
  standalone: true,
  imports: [
    MenuComponent,
    RouterLink,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './caissiers.component.html',
  styleUrl: './caissiers.component.scss'
})
export class CaissiersComponent implements OnInit{

  caissiers !:any;
  caissierForm!:FormGroup;
  ngOnInit() {
    this.listCaissier();
  }

  addCaissier = false;

  showAd(){
    this.addCaissier = true;
  }
  closeAd(){
    this.addCaissier = false;
    this.updateView = false;
  }

  constructor(private caissierService:CaisseService,private formBuilder:FormBuilder) {
    this.caissierForm = formBuilder.group({
      login:[''],
      password:[''],
      fullName:['']
    })
  }

  listCaissier(){
    this.caissierService.listCaissier().subscribe(
      res=>{
        this.caissiers = res;
        console.log(res);

      }
    );
  }

onSubmit(){
  //   let formData = new FormData();
  //   console.log(this.caissierForm.value);
  //   formData.append("login",this.caissierForm.value['login']);
  //   formData.append("fullName",this.caissierForm.value['fullName']);
  //   formData.append("password",this.caissierForm.value['password']);
    let caissier = new Caissier();
    caissier.login= this.caissierForm.value['login'];
    caissier.fullName = this.caissierForm.value['fullName'];
    caissier.password = this.caissierForm.value['password'];
    this.caissierService.saveCaissier(caissier).subscribe(
      {
        next:response=>{
          alert(`Caissier ${this.caissierForm.value['fullName']} est bien cree`)
          this.caissierForm.reset()
          this.addCaissier = false;
          window.location.reload();
        },
        error:err=>{
          alert(`Quelque chose n'a pas marche : ${err.message}`)
        }
      }
    )
}

deleteCaissier(id:any){
    if(confirm("Voulez vous vraiment supprimer ce caissier ")){
      this.caissierService.deleteCaissier(id).subscribe(
        {
          next:response=>{
              alert("Caissier supprimer avec succes");
              window.location.reload();
          },
          error:err => {
            alert("Quelque chose n'a pas fonctionnee...")
          }
        }
      )
    }

}
caissier!:Caissier;
  login:any;
  fullName:any;
  password:any;
  updateView = false;
viewCaissier(id:any,update:boolean){

   if(update === true){
     this.caissierService.getCaissierById(id).subscribe(
       res=>{
         this.caissier = res;
         this.login = res.login;
         this.fullName = res.fullName;
         this.password = res.password;

         this.caissierForm = this.formBuilder.group({
           fullName :[this.caissier.fullName],
           login:[this.caissier.login],
           password:[this.caissier.password]
         })
       }
     )
     this.addCaissier = true;
   }else{
     this.updateView = true;
     this.caissierService.getCaissierById(id).subscribe(
       res=>{
         this.caissier = res;
         this.login = res.login;
         this.fullName = res.fullName;
         this.password = res.password;
       }
     )
   }
  // console.log(this.caissierForm.controls['login'].value);

}

}
