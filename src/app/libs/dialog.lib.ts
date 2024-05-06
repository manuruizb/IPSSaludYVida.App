import { from, Observable } from 'rxjs';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

interface DialogOptions {
  message: string,
  type: Dialogtype,
  isHTML?: boolean,
  title?: string,
  lang?:string,
}

export const enum Dialogtype {
  warning = 'warning',
  error = 'error',
  success = 'success',
  info = 'info',
  question = 'question'
}
export default Dialogtype;

export abstract class Dialog {
	
	public static show(message: string, type: Dialogtype, isHTML?: boolean, title?: string,lang?:string): Observable<any> {
		return from(this.openDialog({ message, type, isHTML, title, lang }));
	}

	private static openDialog(options: DialogOptions): Promise<any> {
		return new Promise((resolve) => {
		let title = options.title ?? this.getTitle(options.type)

		let config: SweetAlertOptions = {
			title: title,
			text: options.message,
			icon: options.type as SweetAlertIcon,
			html: options.isHTML ? options.message : undefined,
			confirmButtonText: options.lang =='en' ? 'Accept': 'Aceptar',
			backdrop: true,
			allowOutsideClick: false
		}

		if (options.type == Dialogtype.question) {
			Swal.fire({ ...config, showCancelButton: true, cancelButtonText: options.lang=='en' ?'Cancel':'Cancelar' }).then((result) => resolve(result.isConfirmed));
			return;
		}

		Swal.fire(config).then(() => resolve(true));
		});

	}

	private static getTitle(type: string) {
		let titles: Record<string, string> = {
		'success': '¡Éxito!',
		'error': 'Error!',
		'warning': 'Alerta!'
		};

		return titles[type] ?? '';
	}
}
