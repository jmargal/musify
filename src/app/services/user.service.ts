import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  identity;
  token;

  constructor(private http: HttpClient) {}

  login(user, gethash = null) {
    if (gethash != null) {
      user.gethash = gethash;
    }
    const json = JSON.stringify(user);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${environment.apiUrl}/login`, json, {headers: headers,});
  }

  register(user){
    const json = JSON.stringify(user);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${environment.apiUrl}/user`,json,{headers:headers});
  }

  update(user):Observable<User>{
    const json = JSON.stringify(user);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': this.getToken()});
    return this.http.put<User>(`${environment.apiUrl}/user/${user._id}`,json,{headers:headers});
  }

  getIdentity() {
    let identity = localStorage.getItem('identity');
    if (identity !== "undefined") {
      this.identity = JSON.parse(identity);
    } else {
      this.identity = null;
    }
    return this.identity;
  }  

  getToken() {
    let token = localStorage.getItem('token');
    if (token !== "undefined") { 
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }

  isAdmin(){
    return JSON.parse(localStorage.getItem('identity')).role === 'ROLE_ADMIN';
  }

  
}
