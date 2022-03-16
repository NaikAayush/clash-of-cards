import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PinataService {
  constructor(private http: HttpClient) {}

  async getMetadeta(ipfsHash: string) {
    const data: any = await this.http
      .get(`${environment.apiUrl}metadata/${ipfsHash}`)
      .toPromise();
    return {
      damage: data.damage,
      health: data.health,
      rarity: data.rarity,
    };
  }

  async getIpfs(ipfsHash: string) {
    return await this.http
      .get(`${environment.apiUrl}ipfs/${ipfsHash}`)
      .toPromise();
  }
}
