import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Artist } from '../models/artist';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  constructor(private http: HttpClient) { }

  addArtist(token,artist: Artist){
    const params=JSON.stringify(artist);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.post(`${environment.apiUrl}/artist`, params, {headers: headers});
  }

  getArtists(token:string,page:number,number?:number):Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    if(number){
      return this.http.get<any>(`${environment.apiUrl}/artists/${page}/${number}`,{headers: headers});
    }else{
      return this.http.get<any>(`${environment.apiUrl}/artists/${page}`,{headers: headers});
    }
  }

  getArtist(token:string,id:string):Observable<Artist> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.get<Artist>(`${environment.apiUrl}/artist/${id}`,{headers: headers});
  }

  getArtistByName(token:string,name:string):any{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.get<Artist>(`${environment.apiUrl}/artist/name/${name}`,{headers: headers});
  }

  editArtist(token:string,id:string,artist:Artist){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.put(`${environment.apiUrl}/artist/${id}`,artist,{headers: headers})
  }

  deleteArtist(token:string,id:string){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.delete(`${environment.apiUrl}/artist/${id}`,{headers: headers});
  } 


}
