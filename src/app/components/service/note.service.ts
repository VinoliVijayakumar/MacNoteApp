import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  readonly baseURL = 'http://localhost:3000/notedetails';
  readonly baseSiteURL = 'http://localhost:3000/recentlydeleted';
  // readonly baseURL = 'https://my-json-server.typicode.com/Mvinoli/mockend/notedetails';
  // readonly baseSiteURL = 'https://my-json-server.typicode.com/Mvinoli/mockend/recentlydeleted';
  selectedNode: any = {};
  selectedIndex: 0;
  folderList = [];
  selectedFolderIndex = 0;

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  flist = new BehaviorSubject([]);
  isLoading = new BehaviorSubject(false);

  constructor(private http: HttpClient) { }

  addNotesFolder(folderData: any) {
    return this.http.post(this.baseURL, folderData, { headers: this.headers });
  }

  getNotesFolders() {
    return this.http.get(this.baseURL);
  }

  updateNotesInfo(site: any) {
    return this.http.put(this.baseURL + `/${site.id}`, site);
  }

  getRecentlyDeleted() {
    return this.http.get(this.baseSiteURL);
  }

  addRecentlyDeleted(data: any) {
    return this.http.post(this.baseSiteURL, data, { headers: this.headers });
  }

  deleteRecentlyDeleted(site: any) {
    return this.http.delete(this.baseSiteURL + `/${site.id}`, site);
  }

}
