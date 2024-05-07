import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function requiredIfCheckedValidator(checkedControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(control?.parent){
        const checkedControl = control?.parent?.get(checkedControlName);
        const isChecked = checkedControl?.value;
        
        if (isChecked && control.value === '') {
          return { requiredIfChecked: true };
        }
      }
      
      
      return null;
    };
  }