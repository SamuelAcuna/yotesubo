import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService{
  constructor(
    private http: HttpClient, 
    private afAuth: AngularFireAuth) {}

    async makeSecureRequest(data: any){
      const user = await this.afAuth.currentUser;
      if(user){
        const token = await user.getIdToken();
        return this.http.post('https://my-api.com', data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).toPromise;
      }else{
        throw new Error('User not logged in');
      }
    }
    
}