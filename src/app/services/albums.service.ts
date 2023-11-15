import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Album } from '../models/album';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  constructor(private http:HttpClient) { }

  addAlbum(token,album: Album){
    const params=JSON.stringify(album);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.post(`${environment.apiUrl}/album`, params, {headers: headers});
  }

  getAlbum(token: string, id: string){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.get(`${environment.apiUrl}/album/${id}`);
  }

  albumsOfArtist(token: string, artist:string){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.get(`${environment.apiUrl}/albums/${artist}`,{headers:headers});

  }

  getAlbums(token: string,){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.get(`${environment.apiUrl}/albums`,{headers: headers});
  }

  editdAlbum(token: string,id:string,album:Album){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.put(`${environment.apiUrl}/album/${id}`,album,{headers: headers})

  }
  
}
