import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Address } from './address';

 
@Injectable({
  providedIn: 'root'
})
export class ViacepService {
  private urlViacep = 'https://viacep.com.br/ws/';
  private urlHeroku = 'https://mighty-ravine-58415.herokuapp.com/api/addresses/';
  private urlLocal = '../assets/cep-90110170.json';

  constructor(private http : HttpClient) { 
    
  }

  getAddressFromViacep(cep: string) {
    return this.http.get<Address>(`${this.urlViacep}${cep}/json/`);
  }
  getAddressFromHeroku(cep: string) {
    return this.http.get<Address>(`${this.urlHeroku}${cep}/`);
  }
  getAddressFromLocal(cep: string) {
    return this.http.get<Address>(this.urlLocal);
  }  
  getAddress(cep: string) {
    return this.getAddressFromLocal(cep);
    //return this.getAddressFromViacep(cep);
    //return this.getAddressFromHeroku(cep);
  }  

}
