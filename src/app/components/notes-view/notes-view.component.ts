import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { NoteService } from '../service/note.service';

@Component({
  selector: 'app-notes-view',
  templateUrl: './notes-view.component.html',
  styleUrls: ['./notes-view.component.css']
})
export class NotesViewComponent implements OnInit, OnDestroy {

  @ViewChild("focusable") _el: ElementRef;

  isReadOnly = false;
  content;
  listViewData = [];
  addSubscription: Subscription;
  updateSubscription: Subscription;
  inactiveSubscription: Subscription;
  currentDate: any = new Date();
  isTouchNoteInput = false;

  @Input() set isRead(value) {
    if (value) {
      this.isReadOnly = value;
    } else {
      this.isReadOnly = false;
    }
  }

  @Input() set noteData(value) {
    if (value != null && value.notesList && value.notesList.length > 0) {
      value.notesList[0].active = true;
      this.listViewData = value.notesList;
      this.content = this.listViewData.length > 0 ? this.listViewData[0].content : "";
      this.noteService.selectedIndex = 0;
      this.noteService.selectedNode = value;
      if (this.listViewData[0].header == "New Note") {
        this.content = "";
      }
      this.isReadOnly = value.isDeleted ? value.isDeleted : false;

      this.currentDate = new Date();
      // this._el.nativeElement.focus();
    } else {
      this.listViewData = [];
      this.content = "";
      this.noteService.selectedIndex = 0;
      this.noteService.selectedNode = null;
    }
  }

  constructor(private noteService: NoteService) {
    // this.setTimeout();  
  }

  ngOnInit(): void {
    this.inactiveSubscription = this.noteInactive.subscribe(() => {
      if (this.isTouchNoteInput) {
        this.isTouchNoteInput = false;
        if (this.content)
          this.addNotesFolder();
      }
    });
  }

  autoSave() {
    if (this.noteService?.selectedNode?.notesList?.length > 0) {
      this.isTouchNoteInput = false;
      this.addNotesFolder();
    }
  }

  addNotesFolder() {
    this.noteService.isLoading.next(true);
    let temp = JSON.parse(JSON.stringify(this.noteService.selectedNode));
    if (this.noteService.selectedNode.notesList?.length > 0) {
      this.noteService.selectedNode.notesList[this.noteService.selectedIndex] = this.listViewData[this.noteService.selectedIndex];
      this.noteService.selectedNode.notesList[this.noteService.selectedIndex].modifiedOn = new Date();
      temp.active = false;
      temp.notesList[this.noteService.selectedIndex].active = false;
    }

    if (this.noteService.selectedNode.id != null && this.noteService.selectedNode.id != "") {
      this.updateSubscription = this.noteService.updateNotesInfo(temp).subscribe((result: any) => {
        if (result) {
          this.noteService.selectedNode.notesList[this.noteService.selectedIndex].active = false;
          this.noteService.selectedNode.notesList.sort((a, b) => ((new Date(a.modifiedOn) > new Date(b.modifiedOn)) ? -1 : 1));
          this.noteService.selectedIndex=0;
          this.noteService.selectedNode.notesList[this.noteService.selectedIndex].active = true;
          this.noteService.folderList[this.noteService.selectedFolderIndex] = this.noteService.selectedNode;
          this.noteService.flist.next(this.noteService.folderList);
        }
        this.noteService.isLoading.next(false);
      });
    } else {
      this.addSubscription = this.noteService.addNotesFolder(temp).subscribe((result: any) => {
        if (result) {
          this.noteService.selectedNode.id = result.name;
          this.noteService.selectedNode = this.noteService.selectedNode;
          this.noteService.folderList[this.noteService.selectedFolderIndex] = this.noteService.selectedNode;
          this.noteService.flist.next(this.noteService.folderList);
        }
        this.noteService.isLoading.next(false);
      });
    }
  }

  onClickNote(item, index) {
    if (this.noteService.selectedIndex != index && this.listViewData[this.noteService.selectedIndex].header == "New Note") {
      this.noteService.selectedNode.notesList.splice(this.noteService.selectedIndex, 1);
      this.noteService.folderList[this.noteService.selectedFolderIndex] = this.noteService.selectedNode;
      this.noteService.flist.next(this.noteService.folderList);
      index = index - 1;
    } else {
      this.listViewData[this.noteService.selectedIndex].active = false;
      this.noteService.selectedNode.notesList[this.noteService.selectedIndex].active = false;
    }
    item.active = true;
    this.content = item.content;
    this.noteService.selectedIndex = index;
    this.currentDate = new Date();
    //this._el.nativeElement.focus();
  }

  onTypeNote() {
    this.isTouchNoteInput = true;
    if (this.listViewData[this.noteService.selectedIndex].header == "New Note") {
      this.listViewData[this.noteService.selectedIndex].header = "";
      this.listViewData[this.noteService.selectedIndex].content = "";
    }

    if (this.content != null && this.content.split('\n').length > 0) {
      let headerText = this.content.split('\n')[0];
      this.listViewData[this.noteService.selectedIndex].header = headerText;
      this.listViewData[this.noteService.selectedIndex].content = this.content;
    } else {
      this.listViewData[this.noteService.selectedIndex].content = this.content;
    }
  }

  noteActivity;
  noteInactive: Subject<any> = new Subject();
  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.noteActivity);
    this.setTimeout();
  }

  setTimeout() {
    this.noteActivity = setTimeout(() => {
      this.noteInactive.next(undefined)
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.addSubscription)
      this.addSubscription.unsubscribe();
    if (this.inactiveSubscription)
      this.inactiveSubscription.unsubscribe();
    if (this.updateSubscription)
      this.updateSubscription.unsubscribe();
  }

}
