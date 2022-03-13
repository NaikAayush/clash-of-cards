import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GaemComponent } from './components/gaem/gaem.component';
import { HomeComponent } from './components/home/home.component';
import { LandingComponent } from './components/landing/landing.component';
import { LeaderbaordComponent } from './components/leaderbaord/leaderbaord.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';

const routes: Routes = [
  { path: 'dashboard', component: HomeComponent },
  { path: 'gaem', component: GaemComponent },
  { path: 'market', component: MarketplaceComponent },
  { path: '', component: LandingComponent },
  { path: 'leaderboard', component: LeaderbaordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
