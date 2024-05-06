import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from '../../services/loader.service';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {

  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(private loaderService: LoaderService) { }
}
