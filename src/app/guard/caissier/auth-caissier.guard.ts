import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {CaisseService} from '../../services/auth/caisse/caisse.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
export class AuthCaissierGuard {
//   constructor(private caisseService: CaisseService, private router: Router) {}
//
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     if (this.caisseService.getLoginIn()) { // Remplacez par la méthode appropriée pour vérifier l'authentification
//       return true; // L'utilisateur est authentifié, autoriser l'accès
//     } else {
//       this.router.navigate(['/caissier/connexion']); // Rediriger vers la page de connexion si non authentifié
//       return false; // L'utilisateur n'est pas authentifié, refuser l'accès
//     }
//   }
// }
//
// export const authCaissierGuard: CanActivateFn = (route, state) => {
//   const guard = new AuthCaissierGuard(new CaisseService(),new Router())
//   return .canActivate(route, state);
// };

// export class AuthGuard implements CanActivate {
//
//
//   constructor(private router: Router,private caissierService:CaisseService) {
//     const caissierLog = this.caissierService.getLoginV;
//     if(caissierLog){
//       this.caissierService.setLoginIn(true);
//     }
//   }
//
//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ):Observable<boolean> | Promise<boolean> | boolean{
//     if(this.caissierService.getLoginV()){
//       return true;
//     }
//     else{
//       this.router.navigate(['caissier/connexion']);
//       return false;
//     }
//   }
}


