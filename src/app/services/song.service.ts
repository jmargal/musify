import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Song } from '../models/song';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(private http: HttpClient) { }

  addSong(token,song:Song){
    const params=JSON.stringify(song);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.post(`${environment.apiUrl}/song`, params, {headers: headers});
  }

  editSong(token,song:Song,id){
    const params=JSON.stringify(song);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.put(`${environment.apiUrl}/song/${id}`, params, {headers: headers});
  }

  getSong(token,id:string){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.get(`${environment.apiUrl}/song/${id}`, {headers: headers});
  }
  
  getSongsOfAlbum(token,id:string){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token});
    return this.http.get(`${environment.apiUrl}/songs/album/${id}`, {headers: headers});
  }

  getSongFile(id:string){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    headers.append('Accept', 'audio/mpeg');
    return this.http.get(`${environment.apiUrl}/song/file/${id}`, {headers: headers,responseType: 'blob'});
  }

}
