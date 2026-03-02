import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { MainPageComponent } from './views/main-page/main-page.component';
import { AuthGuard } from './auth.guard';
import { ShopComponent } from './views/shop/shop.component';

const routes: Routes = [
  {path:'login', component:LoginPageComponent},
  {path:'shop', component:ShopComponent},
  {path: '**', component: MainPageComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}
