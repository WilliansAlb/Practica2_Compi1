import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class AnalizarService {

  constructor(private http:HttpClient) { }

  escribirDatos(texto:string): Observable <any>{
    const body = {
      text: texto
    }
    let con = this.http.post('http://localhost:3000/analizar',body);
    return con;
  }

  analizarCon(texto:string): Observable <any>{
    const body = {
      text: texto
    }
    let con = this.http.post('http://localhost:3000/entrada',body);
    return con;
  }

  analizarCon2(texto:string, entrada: string): Observable <any>{
    const body = {
      text: texto,
      entrada: entrada
    }
    let con = this.http.post('http://localhost:3000/entrada',body);
    return con;
  }

  obtenerCuantos(): Observable <any>{
    let con = this.http.get('http://localhost:3000/cantidad');
    return con;
  }
}
