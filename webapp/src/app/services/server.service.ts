import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  constructor(private http: HttpClient) {}

  async mintInitToken(account: string) {
    const data: any = await this.http
      .get(`${environment.apiUrl}token/${account}`)
      .toPromise();
    console.log(data);
  }

  async mintInitNFT(account: string) {
    const data: any = await this.http
      .get(`${environment.apiUrl}nft/${account}`)
      .toPromise();
    console.log(data);
  }
}
