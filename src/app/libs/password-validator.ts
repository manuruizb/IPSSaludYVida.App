import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value: string = control.value;
    
    // Verificar longitud mínima y máxima
    if (value.length < 8 || value.length > 15) {
      return { 'passwordLength': true };
    }

    // Verificar caracteres especiales
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!specialCharacters.test(value)) {
      return { 'passwordSpecialCharacters': true };
    }

    // Verificar mayúsculas
    if (!(/[A-Z]/.test(value))) {
      return { 'passwordUpperCase': true };
    }

    // Verificar minúsculas
    if (!(/[a-z]/.test(value))) {
      return { 'passwordLowerCase': true };
    }

    // Verificar números
    if (!(/\d/.test(value))) {
      return { 'passwordNumber': true };
    }

    return null;
  };
}