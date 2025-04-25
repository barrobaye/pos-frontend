import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CaisseService} from '../../services/auth/caisse/caisse.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-connexion-cais',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './connexion-cais.component.html',
  styleUrl: './connexion-cais.component.scss'
})
export class ConnexionCaisComponent {

  caissierForm:FormGroup;

  constructor(private formBuilder:FormBuilder,private caissierService:CaisseService,private router:Router) {
    this.caissierForm = this.formBuilder.group({
      login:[],
      password:[]
    })
  }


  onSubmit(){
      let formData = new FormData();
      formData.append("login",this.caissierForm.value['login']);
      formData.append("password",this.caissierForm.value['password']);

      this.caissierService.connexionCais(formData).subscribe(
        {
          next:response=>{
            this.caissierService.setLoginIn(true);
            this.caissierService.setLoginV(this.caissierForm.value['login']);
            this.router.navigate(['/pos',this.caissierForm.value['login']]);
          },
          error:err => {
            alert("Quelque chose ne s'est pas bien passe...!Reessayez :)");
          }
        }
      )
  }

}
