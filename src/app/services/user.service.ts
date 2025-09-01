import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Role {
  id: number;
  roleId: number;
  roleName: string;
  createdAt: string;
}

export interface User {
  id?: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  userId: string;
  roleId: number;
  presentAddress: string;
  mobileNo: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = environment.apiUrl;
  private registerEndpoint = `${this.apiUrl}/api/users/registerNewUser`;
  private rolesEndpoint = `${this.apiUrl}/api/lookup/roles`;

  constructor(private http: HttpClient) {}

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.registerEndpoint, user);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.rolesEndpoint);
  }
}
