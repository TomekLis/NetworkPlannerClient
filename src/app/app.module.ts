import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { InitialStepComponent } from './components/creator-steps/initial-step/initial-step.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatOptionModule,
  MatSlideToggleModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderNavComponent } from './components/header-nav/header-nav.component';
import { HomeComponent } from './components/home/home.component';
import { ConfigService } from './utils/config.service';
import { RouterModule, Routes, Router } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AuthGuardService } from './utils/auth-guard.service';
import { UserService } from './services/user.service';
import { HttpModule, XHRBackend } from '@angular/http';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AuthenticateXHRBackendService } from './utils/authenticate-xhrbackend.service';

@NgModule({
  declarations: [
    AppComponent,
    InitialStepComponent,
    HeaderNavComponent,
    HomeComponent,
    LoginFormComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'login',
        component: LoginFormComponent
      }
    ])
  ],
  providers: [
    AuthGuardService,
    ConfigService,
    {
      provide: XHRBackend,
      useClass: AuthenticateXHRBackendService
    },
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    UserService,
    MatSlideToggleModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
