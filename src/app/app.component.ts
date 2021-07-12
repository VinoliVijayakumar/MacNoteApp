import { Component } from '@angular/core';
import { NoteService } from './components/service/note.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NotesApp';
  loading: boolean;
  
  constructor(private noteService: NoteService) {
    this.noteService.isLoading.subscribe((v) => {
      this.loading = v;
    });
  }
}
