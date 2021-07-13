import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { NoteService } from '../service/note.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  isReadOnly = false;
  folderList = [];
  currentNote: any = {};
  prevIndex = 0;
  deletedList = [];
  newNoteData = {
    header: "New Note",
    content: "No additional text",
    createdOn: new Date(),
    modifiedOn: new Date()
  };
  searchTerm: string;
  status: boolean = false;
  noteSubscription: Subscription;
  recentSubscription: Subscription;
  updateSubscription: Subscription;

  constructor(private noteService: NoteService) {

  }

  ngOnInit(): void {
    this.noteService.flist.subscribe((v) => {
      this.folderList = v;
    });
    this.deletedList = [];
    this.folderList = [];

    this.getNotesFolders();
    this.getRecentlyDeleted();

    this.noteService.folderList = this.folderList;
    this.noteService.selectedFolderIndex = 0;
  }

  clickEvent() {
    this.status = !this.status;
  }

  getNotesFolders() {
    this.noteService.isLoading.next(true);
    this.noteSubscription = this.noteService.getNotesFolders().subscribe((res: any) => {
        let result=[];
      if (res) {
        for(var prob in res){
          res[prob].id=prob;
          result.push(res[prob]);
        }
        result.forEach((element, index) => {
          element.active=false;
          element.notesList.sort((a, b) => ((new Date(a.modifiedOn) > new Date(b.modifiedOn)) ? -1 : 1));
        });
        result.sort((a, b) => ((a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1));
       
        this.folderList = result;
        this.noteService.selectedFolderIndex = 0;
        this.folderList[this.noteService.selectedFolderIndex].active = true;
        
        this.noteService.flist.next(this.folderList);
        this.noteService.folderList = this.folderList;
        this.currentNote = this.folderList[0];
      }
      this.noteService.isLoading.next(false);
    });
  }

  getRecentlyDeleted() {
    this.noteService.isLoading.next(true);
    this.recentSubscription = this.noteService.getRecentlyDeleted().subscribe((res: any) => {
      let result=[];
      if (res) {
        for(var prob in res){
          res[prob].id=prob;
          result.push(res[prob]);
        }
        result.sort((a, b) => ((new Date(a.modifiedOn) > new Date(b.modifiedOn)) ? -1 : 1));
        this.deletedList = result;
      }
      this.noteService.isLoading.next(false);
    });
  }

  createFolder() {
    if ((this.searchTerm!=undefined && this.searchTerm?.length) ||
      (this.currentNote?.notesList?.length>0 &&
      this.currentNote?.notesList[0] != null && this.currentNote?.notesList[0]?.header == "New Note")) {
      return;
    }
    this.rdActive = false;
    this.setValue();
    this.folderList.push(
      {
        id: '',
        name: "",
        notesList: [
          {
            folderName: "",
            header: "New Note",
            content: "New Note \n No additional text",
            active: false,
            createdOn: new Date(),
            modifiedOn: new Date(),
          }
        ],
        show: true,
        active: true
      }
    );

    this.noteService.selectedFolderIndex = this.folderList.length - 1;
    this.folderList[this.noteService.selectedFolderIndex].active = true;
  }

  changeFolderName(item, fIndex) {
    item.show = true;
    this.noteService.isLoading.next(true);
    this.folderList[fIndex].notesList.forEach((element, index) => {
      this.folderList[fIndex].notesList[index].folderName = item.name;
      this.folderList[fIndex].notesList[index].modifiedOn = new Date();
    });


    this.updateSubscription = this.noteService.updateNotesInfo(this.folderList[fIndex]).subscribe((result: any) => {
      if (result) {
        result.id=this.folderList[fIndex].id;
        this.folderList[fIndex] = result;
        this.noteService.folderList[fIndex] = result;
        this.folderList.sort((a, b) => ((a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1));
      }
      this.noteService.isLoading.next(false);
    });
  }

  saveFolderName(item) {
    if (item.name == null || item.name == '') {
      item.name = "New Folder";
    }
    item.show = false;
    this.folderList[this.noteService.selectedFolderIndex].notesList[0].folderName = item.name;
    this.folderList.sort((a, b) => ((a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1));
    this.noteService.selectedFolderIndex = this.folderList.findIndex(lItem => (lItem.id == item.id));
    //this.openNotes(this.folderList[this.noteService.selectedFolderIndex], this.noteService.selectedFolderIndex);
    item.active = true;
    this.currentNote = JSON.parse(JSON.stringify(item));
    this.folderList[this.noteService.selectedFolderIndex].active = true;
    this.noteService.selectedFolderIndex = this.noteService.selectedFolderIndex;

  }

  openNotes(item, index) {
    this.rdActive = false;
    this.setValue();
    if (this.folderList[this.noteService.selectedFolderIndex].notesList?.length > 0 && this.folderList[this.noteService.selectedFolderIndex].notesList[this.noteService.selectedIndex].header == "New Note") {
      this.noteService.selectedNode.notesList.splice(this.noteService.selectedIndex, 1);
      this.noteService.folderList[this.noteService.selectedFolderIndex] = this.noteService.selectedNode;
      this.noteService.flist.next(this.noteService.folderList);
    }

    item.active = true;
    this.currentNote = JSON.parse(JSON.stringify(item));
    this.folderList[index].active = true;
    this.noteService.selectedFolderIndex = index;
  }

  createNewNote() {
    if (this.currentNote.notesList[0] != null && this.currentNote.notesList[0].header == "New Note") {
      return;
    }
    if (this.currentNote.notesList != null && this.currentNote.notesList[this.noteService.selectedIndex] != null) {
      this.currentNote.notesList[this.noteService.selectedIndex].active = false;
    }
    this.currentNote.notesList.unshift({
      folderName: this.currentNote.name,
      header: "New Note",
      content: "New Note \n No additional text",
      createdOn: new Date(),
      modifiedOn: new Date()
    });
    this.currentNote = JSON.parse(JSON.stringify(this.currentNote));

    this.folderList[this.noteService.selectedFolderIndex] = JSON.parse(JSON.stringify(this.currentNote));
    this.noteService.folderList = JSON.parse(JSON.stringify(this.folderList));
  }

  deleteNote() {
    if (this.currentNote.notesList != null && this.currentNote.notesList[this.noteService.selectedIndex] != null) {
      let dData = this.currentNote.notesList[this.noteService.selectedIndex];
      dData.folderName = this.currentNote.name;
      dData.active = false;
      dData.id = 0;

      if (dData.header == "New Note") {
        this.currentNote.notesList.splice(this.noteService.selectedIndex, 1);
        this.noteService.folderList[this.noteService.selectedFolderIndex] = this.currentNote;
        this.folderList[this.noteService.selectedFolderIndex] = this.currentNote;
        this.noteService.flist.next(this.folderList);
      } else {
        this.currentNote.notesList.splice(this.noteService.selectedIndex, 1);
        let addRecentlyDeleted = this.noteService.addRecentlyDeleted(dData);
        let updateNotesInfo = this.noteService.updateNotesInfo(this.currentNote);
        this.noteService.isLoading.next(true);
        forkJoin([addRecentlyDeleted, updateNotesInfo]).subscribe((result: any) => {
          if (result) {
            if (result[0]!=null && result[0].name!=null){
              dData.id = result[0].name;
              this.deletedList.push(dData);
            }

            if (result[1]) {
              this.noteService.folderList[this.noteService.selectedFolderIndex] = this.currentNote;
              this.folderList[this.noteService.selectedFolderIndex] = this.currentNote;
              this.noteService.flist.next(this.folderList);
            }
          }
          this.noteService.isLoading.next(false);
        });
      }


    } else {
      this.currentNote.notesList = [];
    }

    this.currentNote = JSON.parse(JSON.stringify(this.currentNote));
    this.folderList[this.noteService.selectedFolderIndex] = JSON.parse(JSON.stringify(this.currentNote));
    this.noteService.folderList = JSON.parse(JSON.stringify(this.folderList));
  }


  rdActive = false;
  deletedNotes() {
    this.rdActive = true;
    this.setValue();
    this.currentNote = JSON.parse(JSON.stringify({
      name: "Note",
      notesList: this.deletedList,
      isDeleted: true
    }));
  }

  setValue() {
    if (this.folderList.length > 0) {
      if (this.folderList[this.noteService.selectedFolderIndex] != null && this.folderList[this.noteService.selectedFolderIndex].name != null &&
        this.folderList[this.noteService.selectedFolderIndex].name != '') {

        this.folderList[this.noteService.selectedFolderIndex].show = false;
        this.folderList[this.noteService.selectedFolderIndex].active = false;
        if (this.folderList[this.noteService.selectedFolderIndex].notesList.length > 0)
          this.folderList[this.noteService.selectedFolderIndex].notesList[this.noteService.selectedIndex].active = false;
        this.noteService.selectedNode = this.folderList[this.noteService.selectedFolderIndex];

      } else {
        this.folderList.splice(this.noteService.selectedFolderIndex, 1);
      }
    }

  }


  search() {
    if (this.searchTerm != null && this.searchTerm != '') {
      let filteredArr = [];
      let tempFolderList = JSON.parse(JSON.stringify(this.noteService.folderList));
      tempFolderList.filter((item) => {
        let data = item.notesList.filter((nodes) => {
          return nodes.header.includes(this.searchTerm) || nodes.content.includes(this.searchTerm);
        });
        if (data.length > 0) {
          item.notesList = data;
          filteredArr.push(item);
          if (filteredArr.length == 1) filteredArr[0].active = true;
          else
          filteredArr[filteredArr.length-1].active = false;
        }

      });
      this.folderList = filteredArr;
      this.currentNote = this.folderList[0];
      this.isReadOnly = true;
    } else {
      this.rdActive = false;
      this.isReadOnly = false;
      this.getNotesFolders();
    }
  }

  ngOnDestroy() {
    if (this.noteSubscription)
      this.noteSubscription.unsubscribe();

    if (this.updateSubscription)
      this.updateSubscription.unsubscribe();

    if (this.recentSubscription)
      this.recentSubscription.unsubscribe();
  }

}
