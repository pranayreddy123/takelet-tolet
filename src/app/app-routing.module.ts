import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  {
    path: 'postadd',
    loadChildren: () => import('./postadd/postadd.module').then( m => m.PostaddPageModule)
  }
];
@NgModule({
  imports:
    [
      RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
  exports:
    [
      RouterModule
    ]
})
export class AppRoutingModule {}