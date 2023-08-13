import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
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
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ServerMapPageComponent } from './pages/server-map-page/server-map-page.component';
import { ServerOrderPageComponent } from './pages/server-order-page/server-order-page.component';
import { CookerOrdersPageComponent } from './pages/cooker-orders-page/cooker-orders-page.component';
import { OrderMenuComponent } from './components/order-menu/order-menu.component';
import { OrderCategoryButtonComponent } from './components/order-category-button/order-category-button.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { AdminReservationFormComponent } from './components/admin-reservation-form/admin-reservation-form.component';
import { AdminCategoryFormComponent } from './components/admin-category-form/admin-category-form.component';
import { AdminItemFormComponent } from './components/admin-item-form/admin-item-form.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ItemButtonComponent } from './components/item-button/item-button.component';
import { CategoryButtonComponent } from './components/category-button/category-button.component';
import { OrderService } from './services/order.service';
import { ReservationService } from './services/reservation.service';
import { TableService } from './services/table.service';
import { CategoryService } from './services/category.service';
import { TableButtonComponent } from './components/table-button/table-button.component';
import { ImageService } from './services/image.service';
import { DragableIconComponent } from './components/dragable-icon/dragable-icon.component';
import { InsertionPointDirective } from './directives/insertion-point.directive';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'admin', component: AdminPageComponent, canActivate: [AuthGuardService] },
  { path: 'admin/employees', component: AdminEmployeePageComponent, canActivate: [AuthGuardService] },
  { path: 'admin/reports', component: AdminReportsPageComponent, canActivate: [AuthGuardService] },
  { path: 'admin/map', component: AdminMapPageComponent, canActivate: [AuthGuardService] },
  { path: 'admin/editmenu', component: AdminEditmenuPageComponent, canActivate: [AuthGuardService] },
  { path: 'admin/reservations', component: AdminReservationsPageComponent, canActivate: [AuthGuardService] },
  { path: 'admin/images', component: AdminImagesPageComponent, canActivate: [AuthGuardService] },
  { path: 'server/map', component: ServerMapPageComponent, canActivate: [AuthGuardService] },
  { path: 'server/order', component: ServerOrderPageComponent, canActivate: [AuthGuardService] },
  { path: 'cooker/orders', component: CookerOrdersPageComponent, canActivate: [AuthGuardService] },
  { path: '**', component: LoginPageComponent }

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
    AdminCategoryFormComponent,
    AdminItemFormComponent,
    ItemButtonComponent,
    CategoryButtonComponent,
    TableButtonComponent,
    InsertionPointDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    MatDialogModule,
    DragableIconComponent,
    CdkDropList,
    CdkDrag
  ],
  providers: [
    UserService,
    AuthService,
    CategoryService,
    OrderService,
    ReservationService,
    TableService,
    ImageService,
    MatDialog,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: false, autoFocus: true } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
