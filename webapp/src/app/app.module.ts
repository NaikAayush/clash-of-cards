import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GaemComponent } from './components/gaem/gaem.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DraggableCardComponent } from './components/draggable-card/draggable-card.component';
import { HomeComponent } from './components/home/home.component';
import { CardItemComponent } from './components/home/card-item/card-item.component';
import { AuthComponent } from './components/auth/auth.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { CardItemMarketComponent } from './components/marketplace/card-item-market/card-item-market.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    GaemComponent,
    HomeComponent,
    CardItemComponent,
    AuthComponent,
    DraggableCardComponent,
    MarketplaceComponent,
    CardItemMarketComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
