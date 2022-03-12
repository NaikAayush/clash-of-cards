import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GaemComponent } from './components/gaem/gaem.component';

const routes: Routes = [{ path: 'gaem', component: GaemComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
