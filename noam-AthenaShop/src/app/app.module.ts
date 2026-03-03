import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MainPageComponent } from './views/main-page/main-page.component';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LogoComponent } from './components/logo/logo.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ShopComponent } from './views/shop/shop.component';
import { ShoeCardComponent } from './components/shoe-card/shoe-card.component';
import { NewestShoeComponent } from './components/newest-shoe/newest-shoe.component';
import { FilterComponent } from './components/filter/filter.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { SliderComponent } from './components/slider/slider.component';
import { PopUpComponent } from './components/pop-up/pop-up.component';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { ApolloModule } from 'apollo-angular';
 
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    MainPageComponent,
    NavbarComponent,
    LogoComponent,
    ShopComponent,
    ShoeCardComponent,
    NewestShoeComponent,
    FilterComponent,
    SliderComponent,
    PopUpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    NgxSliderModule,
    MatExpansionModule,
    MatSliderModule,
    FormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    BrowserModule,
    ApolloModule
  ],
    providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink): ApolloClientOptions<any> => {

        const http = httpLink.create({
          uri: 'https://helpful-crow-38.hasura.app/v1/graphql',
        });

        const auth = setContext((_, { headers }) => ({
          headers: {
            ...headers,
            'x-hasura-admin-secret': 'NU6VbveJ97irpguhPSWQtrXhhvFCq4kP75IKKkql3viL0zUO0HCDJZZecH8txTjU',
          },
        }));
        return {
          cache: new InMemoryCache(),
          link: ApolloLink.from([auth, http]),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
