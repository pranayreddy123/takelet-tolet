import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostaddPage } from './postadd.page';

const routes: Routes = [
  {
    path: '',
    component: PostaddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostaddPageRoutingModule {}
