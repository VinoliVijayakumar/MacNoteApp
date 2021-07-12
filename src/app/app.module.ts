import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotesViewComponent } from './components/notes-view/notes-view.component';
import { FormsModule } from '@angular/forms';
import { DataFormatPipe } from './pipes/data-format.pipe';
import { HttpClientModule } from '@angular/common/http';
import { AutoFocusDirective } from './directives/autofocus.directive';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NotesViewComponent,
    DataFormatPipe,
    AutoFocusDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
