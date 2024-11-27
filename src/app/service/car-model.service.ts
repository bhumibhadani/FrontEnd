import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarModel } from '../model/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarModelService {
  private apiUrl = 'https://localhost:7170/api/Car';

  constructor(private http: HttpClient) { }

  // Method to get the list of car models from the API
  getCarModels(): Observable<CarModel[]> {
    return this.http.get<CarModel[]>(this.apiUrl);
  }
  getCarModelswithId(id: any): Observable<CarModel[]> {
    return this.http.get<CarModel[]>(`${this.apiUrl}/${id}`);
  }

  // Method to add a new car model
  addCarModel(newModel: CarModel): Observable<CarModel> {
    return this.http.post<CarModel>(this.apiUrl, newModel);
  }

  // Method to delete a car model
  deleteCarModel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Method to update a car model
  updateCarModel(id: number, updatedModel: CarModel): Observable<CarModel> {
    return this.http.put<CarModel>(`${this.apiUrl}/${id}`, updatedModel);
  }
  uploadImages(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl+"/upload", formData);
  }
}
