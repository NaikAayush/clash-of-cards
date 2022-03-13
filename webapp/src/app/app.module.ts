import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GaemComponent } from './components/gaem/gaem.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DraggableCardComponent } from './components/draggable-card/draggable-card.component';

@NgModule({
  declarations: [AppComponent, GaemComponent, DraggableCardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
