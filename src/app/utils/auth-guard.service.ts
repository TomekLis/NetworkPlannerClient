import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private user: UserService, private router: Router) {}

  canActivate(state: RouterStateSnapshot) {
    if (!this.user.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    return true;
  }
}
