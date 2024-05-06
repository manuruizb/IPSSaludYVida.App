import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TablesEnum } from '../models/tables.enum';
import { Result } from '../models/result.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  private url: string = environment.urlapi + "/Master"

  constructor(
    private http: HttpClient
  ) { }

  getAll<TOutput>(table: TablesEnum, param?: string) {
    return this.http.get<Result<TOutput[]>>(`${this.url}`, {
      params: param ? {
        table,
        param: param!
      } : { table }
    });
  }
}
