import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminButtonComponent } from './components/admin-button/admin-button.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminEmployeePageComponent } from './pages/admin-employee-page/admin-employee-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AdminReportsPageComponent } from './pages/admin-reports-page/admin-reports-page.component';
import { AdminMapPageComponent } from './pages/admin-map-page/admin-map-page.component';
import { AdminEditmenuPageComponent } from './pages/admin-editmenu-page/admin-editmenu-page.component';
import { AdminReservationsPageComponent } from './pages/admin-reservations-page/admin-reservations-page.component';
import { AdminImagesPageComponent } from './pages/admin-images-page/admin-images-page.component';
import { AdminEmployeeFormComponent } from './components/admin-employee-form/admin-employee-form.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ServerMapPageComponent } from './pages/server-map-page/server-map-page.component';
import { ServerOrderPageComponent } from './pages/server-order-page/server-order-page.component';
import { CookerOrdersPageComponent } from './pages/cooker-orders-page/cooker-orders-page.component';
import { OrderMenuComponent } from './components/order-menu/order-menu.component';
import { OrderCategoryButtonComponent } from './components/order-category-button/order-category-button.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { AdminReservationFormComponent } from './components/admin-reservation-form/admin-reservation-form.component';
import { AdminMenuListComponent } from './components/admin-menu-list/admin-menu-list.component';
import { AdminCategoryFormComponent } from './components/admin-category-form/admin-category-form.component';
import { AdminItemFormComponent } from './components/admin-item-form/admin-item-form.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: 'admin/employees', component: AdminEmployeePageComponent },
  { path: 'admin/reports', component: AdminReportsPageComponent },
  { path: 'admin/map', component: AdminMapPageComponent },
  { path: 'admin/editmenu', component: AdminEditmenuPageComponent },
  { path: 'admin/reservations', component: AdminReservationsPageComponent },
  { path: 'admin/images', component: AdminImagesPageComponent },
  { path: 'server/map', component: ServerMapPageComponent },
  { path: 'server/order', component: ServerOrderPageComponent },
  { path: 'cooker/orders', component: CookerOrdersPageComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    AdminButtonComponent,
    AdminPageComponent,
    AdminEmployeePageComponent,
    LoginPageComponent,
    AdminReportsPageComponent,
    AdminMapPageComponent,
    AdminEditmenuPageComponent,
    AdminReservationsPageComponent,
    AdminImagesPageComponent,
    AdminEmployeeFormComponent,
    ConfirmationModalComponent,
    IconButtonComponent,
    ServerMapPageComponent,
    ServerOrderPageComponent,
    CookerOrdersPageComponent,
    OrderMenuComponent,
    OrderCategoryButtonComponent,
    TicketComponent,
    AdminReservationFormComponent,
    AdminMenuListComponent,
    AdminCategoryFormComponent,
    AdminItemFormComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [
    UserService,
    AuthService,
    MatDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
