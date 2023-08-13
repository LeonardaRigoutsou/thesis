import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-server-map-page',
  templateUrl: './server-map-page.component.html',
  styleUrls: ['./server-map-page.component.css']
})
export class ServerMapPageComponent {

  constructor(private authService: AuthService, private router: Router) { }

  onLogout() {
    this.authService.logout();
  }

  onTableClick(tableId: number) {
    this.router.navigate(['server', 'order'], {
      queryParams: {
        table: tableId
      }
    });
  }
}
