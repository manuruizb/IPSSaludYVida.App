import { Component, Input, Injectable, NgModule, ViewContainerRef, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Observable, Subscription } from 'rxjs';

export interface ContentDescriptor {
  placeholder: string;
  elementRef: ElementRef;
}

@Injectable()
export class ContentService {
  contentInit$ = new Subject<ContentDescriptor>();

  contentInit(): Observable<ContentDescriptor> {
    return this.contentInit$.asObservable();
  }

  registerContent(content: ContentDescriptor) {
    this.contentInit$.next(content);
  }
}

@Component({
  selector: 'master-content',
  template: '<ng-content></ng-content>'
})
export class ContentComponent {
  @Input() placeholder: string = '';

  constructor(
    private elementRef: ElementRef,
    private contentService: ContentService
  ) { }

  ngOnInit() {
    this.contentService.registerContent({
      placeholder: this.placeholder,
      elementRef: this.elementRef
    });
  }
}

@Component({
  selector: 'master-placeholder',
  template: '<ng-content></ng-content>'
})
export class PlaceholderComponent {
  @Input() name: string = '';

  subscription: Subscription;

  constructor(
    private containerRef: ViewContainerRef,
    private contentService: ContentService
  ) {
    this.subscription = contentService.contentInit().subscribe((content: ContentDescriptor) => {
      /* istanbul ignore else */
      if (content.placeholder == this.name) {
        this.containerRef.clear();
        this.containerRef.element.nativeElement.appendChild(content.elementRef.nativeElement);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

@NgModule({
  declarations: [PlaceholderComponent, ContentComponent],
  exports: [PlaceholderComponent, ContentComponent],
  providers: [ContentService],
  imports: [
    CommonModule
  ]
})
export class MasterPageModule { }






