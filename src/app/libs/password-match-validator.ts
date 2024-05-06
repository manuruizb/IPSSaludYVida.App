import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password1 = control.get('contrasenia1') as AbstractControl;
    const password2 = control.get('contrasenia2') as AbstractControl;

    return password1 && password2 && password1.value !== password2.value ? { 'passwordMismatch': true } : null;
  };
}
