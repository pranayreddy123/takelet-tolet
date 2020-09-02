import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListviewPage } from './listview.page';

const routes: Routes = [
  {
    path: '',
    component: ListviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListviewPageRoutingModule {}
