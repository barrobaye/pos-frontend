import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AdminService} from '../../../services/auth/admin/admin.service';
import {response} from 'express';
import {Router} from '@angular/router';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss'
})
export class ConnexionComponent {

  connexionForm: FormGroup;
  constructor(private formBuilder:FormBuilder,private adminConnexion:AdminService,private route:Router) {
    this.connexionForm = this.formBuilder.group({
      login:[''],
      password:['']
    })
  }

  onSubmit(){
      let formData = new FormData();
      formData.append("login",this.connexionForm.value['login']);
      formData.append("pwd",this.connexionForm.value['password']);

      this.adminConnexion.connexionAdmin(formData).subscribe(
        {
          next:response=>{
            this.adminConnexion.setLoginIn(true);
            this.adminConnexion.setLoginA(this.connexionForm.value['login']);
            this.route.navigate(['/dash']);
          },
          error:err => {
            alert("Quelque chose ne s'est pas bien passe...");
          }
        }
      )
  }

}
