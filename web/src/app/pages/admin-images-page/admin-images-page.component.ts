import { Component } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-admin-images-page',
  templateUrl: './admin-images-page.component.html',
  styleUrls: ['./admin-images-page.component.css']
})
export class AdminImagesPageComponent {

  selectedLogoFile: string;
  selectedTableFile: string;

  constructor(private imageService: ImageService) { }

  selectLogoImage(event: any) {
    this.selectedLogoFile = event.target.form[0]?.files[0]?.name;
  }

  selectTableImgage(event: any) {
    this.selectedTableFile = event.target.form[0]?.files[0]?.name;
  }

  uploadImage(event: any, type: string) {
    this.imageService.uploadImage(event.target.form[0].files[0], type);
  }
}
