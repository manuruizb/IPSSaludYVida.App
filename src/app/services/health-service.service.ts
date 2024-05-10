import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Result } from '../models/result.model';
import { ServicioSalud } from '../models/servicioSalud.model';

@Injectable({
  providedIn: 'root'
})
export class HealthServiceService {

  private url: string = environment.urlapi + "/ServicioSalud"

  constructor(
    private http: HttpClient
  ) { }

  getAll(page: number, pageSize: number, document: string, searchParameter?: string) {
    return this.http.get<Result<{ rows: ServicioSalud[], count: number }>>(`${this.url}`,
      {
        params: {
          page,
          pagesize: pageSize,
          //searchparam: searchParameter ?? '',
          document
        }
      }
    );
  }

  create(body: any) {
    return this.http.post<Result<string>>(`${this.url}`, body);
  }

  update(body: any) {
    return this.http.put<Result<string>>(`${this.url}`, body);
  }

getByIdService(idServicioSalud: string){
  return this.http.get<Result<ServicioSalud>>(`${this.url}/SearchByIdService`,
      {
        params: {
          idServicioSalud
        }
      }
    );
}

}
