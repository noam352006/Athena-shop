import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/states/auth/auth.service';
import { usersList } from 'src/app/shared/models/userList';
import { User } from 'src/app/shared/intrefaces/user';
import { UserRole } from 'src/app/shared/enums/userRole.enum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authService: AuthService, private router: Router) { }

  doesNameExists(name: string): User | undefined {
    return usersList.find(user => user.userName === name);
  }

  logInUser(user: User): void {
    this.authService.logIn(user);
    const { password, ...displayedUser } = user;
    localStorage.setItem('connectedUser', JSON.stringify(displayedUser));
    this.router.navigate(['']);
  }

  findUser(passwordInput: string, userNameInput: string): User | undefined {
    return usersList.find(user => user.password === passwordInput && user.userName === userNameInput);
  }

  addUser(password: string, userName: string): void {
    const newUser: User = {
      id: crypto.randomUUID(),
      userName: userName,
      password: password,
      role: UserRole.Client,
      dateCreated: new Date(),
      purchaseHistory: [],
    };

    usersList.push(newUser);
    this.logInUser(newUser);
  }

  logOut(): void {
    this.authService.logOut();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
