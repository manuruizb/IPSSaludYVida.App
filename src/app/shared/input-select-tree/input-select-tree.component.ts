import { Component, EventEmitter, HostListener, Input, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'input-select-tree',
  templateUrl: './input-select-tree.component.html',
  styleUrl: './input-select-tree.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectTreeComponent),
      multi: true
    }
  ]
})
export class InputSelectTreeComponent {

  value: string = '';

  isActive: boolean = false;
  searcher: string = '';
  
  preSelectedText: string = 'Todos';

  @Input() disabled: boolean = false;
  @Input() selectedText: string = '';
  @Input() JsonData: { text: string, value: string, isparent: boolean }[] = [];
  @Input() invalidClass:boolean | ValidationErrors | null | undefined = false;

  @Output() onChangeParent = new EventEmitter<string>();
  @Output() onSelectedItem = new EventEmitter<string>();

  toggle() {
    this.isActive = !this.isActive;
  }

  valueSelected(idx: number) {

    const { text, value, isparent } = this.JsonData[idx];
    if (isparent) {

      this.onChangeParent.emit(value);
      this.preSelectedText = text;
    } else {

      this.selectedText = text;
      this.isActive = false;
      this.onSelectedItem.emit(value);
      this.writeValue(value);
    }


  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.drop-down-container')) {
      this.isActive = false;
    }
  }

  onChange: any = () => { };
  onTouch: any = () => { };

  writeValue(value: any): void {
    this.value = value;
    this.onChange(this.value);
    this.onTouch();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
