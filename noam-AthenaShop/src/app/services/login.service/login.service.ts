import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/states/auth/auth.service';
import { usersList } from 'src/app/shared/models/userList';
import { User } from 'src/app/shared/intrefaces/user';
import { Router } from '@angular/router';
import { ApolloService } from '../apollo.service/apollo.service';
import { firstValueFrom, tap } from 'rxjs';
import { partialUser } from 'src/app/shared/intrefaces/partialUser';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private apollo: ApolloService,
  ) {}

  async doesNameExists(name: string): Promise<boolean> {
     const searchesUserName = await firstValueFrom(
      this.apollo.getUserByName(name),
    );
    console.log("checking if userName exists, result: " + searchesUserName)
 
    return searchesUserName? true : false
  }

  // get user from dadta base with password and user name
  async getUserByCredentials(
    password: string,
    userName: string,
  ): Promise<partialUser | null> {
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

  async addUser(password: string, userName: string): Promise<void> {
    const newUser = await firstValueFrom(
      this.apollo.signInUser(password, userName),
    );
    if (!newUser) {
      console.error('somthing went wrong');
    } else {
      console.log( 'created new user with user name: ' + newUser?.userName + ' at ' + newUser?.dateCreated);
      this.connectUser(newUser);
    }
  }

  logOut(): void {
    this.authService.logOut();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
