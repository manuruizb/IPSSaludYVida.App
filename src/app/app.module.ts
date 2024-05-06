import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './pages/users/users.component';
import { MasterPageComponent } from './pages/master-page/master-page.component';
import { DatatableComponent } from './shared/datatable/datatable.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MasterPageModule } from './pages/master-page/master-page.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpConfigInterceptor } from './interceptors/httpconfig.interceptor';
import { HomeComponent } from './pages/home/home.component';
import { HealthServicesComponent } from './pages/health-services/health-services.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { InputSelectTreeComponent } from './shared/input-select-tree/input-select-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    MasterPageComponent,
    DatatableComponent,
    LoaderComponent,
    HomeComponent,
    HealthServicesComponent,
    UserModalComponent,
    InputSelectTreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MasterPageModule,
    FormsModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
