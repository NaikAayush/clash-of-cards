import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GaemComponent } from './components/gaem/gaem.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'gaem', component: GaemComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
