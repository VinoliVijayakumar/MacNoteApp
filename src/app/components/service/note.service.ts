import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  //readonly baseURL = 'http://localhost:3000/notedetails';
  //readonly baseSiteURL = 'http://localhost:3000/recentlydeleted';
  // readonly baseURL = 'https://my-json-server.typicode.com/Mvinoli/mockend/notedetails';
  // readonly baseSiteURL = 'https://my-json-server.typicode.com/Mvinoli/mockend/recentlydeleted';
  
  readonly baseURL = 'https://macnotes-742ea-default-rtdb.firebaseio.com/';
  //readonly baseSiteURL = 'http://localhost:3000/recentlydeleted';
  
  selectedNode: any = {};
  selectedIndex: 0;
  folderList = [];
  selectedFolderIndex = 0;

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  flist = new BehaviorSubject([]);
  isLoading = new BehaviorSubject(false);

  constructor(private http: HttpClient) { }

  addNotesFolder(folderData: any) {
    let apiurl=this.baseURL+"notedetails.json";
    return this.http.post(apiurl, folderData, { headers: this.headers });
  }

  getNotesFolders() {
    let apiurl=this.baseURL+"notedetails.json";
    return this.http.get(apiurl);
  }

  updateNotesInfo(site: any) {
    let apiurl=this.baseURL+"notedetails/"+site.id+".json";
    return this.http.put(apiurl, site);
  }

  getRecentlyDeleted() {
    let apiurl=this.baseURL+"recentlydeleted.json";
    return this.http.get(apiurl);
  }

  addRecentlyDeleted(data: any) {
    let apiurl=this.baseURL+"recentlydeleted.json";
    return this.http.post(apiurl, data, { headers: this.headers });
  }

  deleteRecentlyDeleted(site: any) {
    return this.http.delete(this.baseSiteURL + `/${site.id}`, site);
  }

}
