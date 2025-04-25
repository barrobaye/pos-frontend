import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {

  constructor() { }

  private baseUrl: string = environment.apiUrl;

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getImageUrl(imagePath: string): string {
    return `${this.baseUrl}${imagePath}`;
  }
<<<<<<< HEAD
=======
 /*  getImageUrl(filePath: string | undefined | null): string {
    if (!filePath) return '/assets/default-image.jpg'; // ou une image de fallback
    return '/api/images/' + filePath.replace(/^\/+/, '');
  } */
>>>>>>> mon-travail-local
  getFullPath(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
  }

  getApiImageUrl(filename: string): string {
    return `${this.baseUrl}/api/images/${filename}`;
  }
  

}
