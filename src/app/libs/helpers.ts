import { AbstractControl } from "@angular/forms"

export abstract class Helpers {

    public static haveValue(value: any, defaultValue: any = null ):any {
        if (!!value) { return value } else { return defaultValue }
    }

    public static onlyNumbers(event: any) {
        let charCode = (event.which) ? event.which : event.keyCode
        if ((charCode < 48 || charCode > 57)) {
            event.preventDefault()
        }
    }

    public static onlyStrings(event: any) {
        if (!(/[a-z ]/i.test(String.fromCharCode(event.keyCode)))) {
            event.preventDefault()
        }
    }

    public static noWhitespaceValidator(control: AbstractControl) {

      let empty: boolean = control && control.value && (control.value.trim().length === 0)

      return empty ? { 'whitespace': true } : null
    }

    public static convertDate(dateString: string) {

        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

    public static downloadFile(res: any, fileName: string) {
        const blob = new Blob([res], { type: res.type });
        const url = window.URL.createObjectURL(blob);
        const redirectDownload = document.createElement('a');
        redirectDownload.href = url;
        redirectDownload.setAttribute('download', fileName);
        document.body.appendChild(redirectDownload);
        redirectDownload.click()
    }
    public static downloadFileBlobStorage(url: string) {
        const redirectDownload = document.createElement('a');
        redirectDownload.href = url;
        document.body.appendChild(redirectDownload);
        redirectDownload.click()
    }

    public static formatBytes(bytes: number, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const kb = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(kb));

        return parseFloat((bytes / Math.pow(kb, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    public static addHours(date: any, hours: number) {
      let numberOfMlSeconds = date.getTime();
      let addMlSeconds = (hours * 60) * 60000;
      return new Date(numberOfMlSeconds + addMlSeconds);
    }

    public static addMinutes(date: any, minutes: number) {
      let numberOfMlSeconds = date.getTime();
      let addMlSeconds = minutes * 60000;
      return new Date(numberOfMlSeconds + addMlSeconds);
    }

}