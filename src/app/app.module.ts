import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { AppComponent } from './app.component';
import { InitialStepComponent } from './components/creator-steps/initial-step/initial-step.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
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
import { AreaSelectionStepComponent } from './components/creator-steps/area-selection-step/area-selection-step.component';
import { SensitiveData } from 'src/apiKeys';
import { PlannerService } from './services/planner.service';
import { GridGeneratorService } from './services/grid-generator.service';
import { MapsService } from './services/maps.service';
import { PolygonService } from './services/polygon.service';
import { PlanComponent } from './components/plan/plan.component';
import { PlanListComponent } from './components/plan-list/plan-list.component';
import { PlanDetailsComponent } from './components/plan-details/plan-details.component';
import { LngCoordinatePipe } from './utils/lng-coordinate.pipe';
import { LatCoordinatePipe } from './utils/lat-coordinate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    InitialStepComponent,
    HeaderNavComponent,
    HomeComponent,
    LoginFormComponent,
    SpinnerComponent,
    AreaSelectionStepComponent,
    PlanComponent,
    PlanListComponent,
    PlanDetailsComponent,
    LngCoordinatePipe,
    LatCoordinatePipe
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
    AgmCoreModule.forRoot({
      apiKey: SensitiveData.API_KEY, // hides Google map API key
      libraries: ['places', 'drawing']
    }),
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginFormComponent
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'initial-step',
        component: InitialStepComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'area-selection-step',
        component: AreaSelectionStepComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'created-plan',
        component: PlanComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'plan-list',
        component: PlanListComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'plans/:id',
        component: PlanDetailsComponent,
        canActivate: [AuthGuardService]
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
    PlannerService,
    MatSlideToggleModule,
    GridGeneratorService,
    MapsService,
    PolygonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
