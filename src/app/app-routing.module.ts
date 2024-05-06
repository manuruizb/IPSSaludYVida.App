import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterPageComponent } from './pages/master-page/master-page.component';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { HealthServicesComponent } from './pages/health-services/health-services.component';

const routes: Routes = [
  {
    path: '',
    component: MasterPageComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        component: HomeComponent
      }
    ]
  },
  {
    path: 'usuarios',
    component: MasterPageComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        component: UsersComponent
      }
    ]
  },
  {
    path: 'servicios-de-salud',
    component: MasterPageComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        component: HealthServicesComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
