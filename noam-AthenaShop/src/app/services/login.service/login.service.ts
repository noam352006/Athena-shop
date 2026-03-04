import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/states/auth/auth.service';
import { usersList } from 'src/app/shared/models/userList';
import { User } from 'src/app/shared/intrefaces/user';
import { Router } from '@angular/router';
import { ApolloService } from '../apollo.service/apollo.service';
import { firstValueFrom, tap } from 'rxjs';
import { partialUser } from 'src/app/shared/intrefaces/partialUser';
import { promises } from 'dns';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private apollo: ApolloService,
  ) {}

  doesNameExists(name: string): User | undefined {
    return usersList.find((user) => user.userName === name);
  }

  // get user from dadta base with password and user name
 async getUserByCredentials(password: string, userName: string): Promise<partialUser | null> {
  try {
    const user$ = this.apollo.getUserByInfo(password, userName); // Observable<User>
    const user = await firstValueFrom(user$);
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
}

  //if user exists log them in 
  connectUser(user: partialUser): void {
    if (!user) {
    } else {
      this.authService.logIn(user);
      localStorage.setItem('connectedUser', JSON.stringify(user));
      this.router.navigate(['']);
    }
  }

  findUser(passwordInput: string, userNameInput: string): User | undefined {
    return usersList.find(
      (user) =>
        user.password === passwordInput && user.userName === userNameInput,
    );
  }

  addUser(password: string, userName: string): void {
   this.apollo.signInUser(password, userName)
  }

  logOut(): void {
    this.authService.logOut();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
