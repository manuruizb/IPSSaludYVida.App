import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Result } from '../models/result.model';
import { Usuarios } from '../models/usuarios.model';
import { Pais } from '../models/pais.model';
import { Discapacidad } from '../models/discapacidad.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = environment.urlapi + "/Usuarios"

  constructor(
    private http: HttpClient
  ) { }

  getAll(page: number, pageSize: number, searchParameter?: string) {
    return this.http.get<Result<{ rows: Usuarios[], count: number }>>(`${this.url}`,
      {
        params: {
          page,
          pagesize: pageSize,
          searchparam: searchParameter ?? ''
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

  getByDocument(document: string) {
    return this.http.get<Result<Usuarios>>(`${this.url}/SearchByDocument`,
      {
        params: {
          document
        }
      }
    );
  }

}
