import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/milk/';
  }

  getListProducts(): Observable<Product[]> {
    return this.http.get<{ error: boolean, status: number, body: Product[] }>(`${this.myAppUrl}${this.myApiUrl}`)
      .pipe(
        map(response => response.body) // Extrae los productos del cuerpo de la respuesta
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}`, { body: { id } }); // Enviar ID en el cuerpo
  }

  saveProduct(product: Product): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, product);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  updateProduct(product: Product): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}`, product); // Actualiza con el cuerpo completo
  }
}
