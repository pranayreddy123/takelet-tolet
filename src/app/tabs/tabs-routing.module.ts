import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:
      [
        {
          path: 'home',
          children:
            [
              {
                path: '',
                loadChildren: '../home/home.module#HomePageModule'
              }
            ]
        },
        {
          path: 'listview',
          children:
            [
              {
                path: '',
                loadChildren: '../listview/listview.module#ListviewPageModule'
              }
            ]
        },
        {
          path: 'postadd',
          children:
            [
              {
                path: '',
                loadChildren: '../postadd/postadd.module#PostaddPageModule'
              }
            ]
        },
        {
          path: '',
          redirectTo: '/tabs/listview',
          pathMatch: 'full'
        }
      ]
  },
  {
    path: '',
    redirectTo: '/tabs/listview',
    pathMatch: 'full'
  }
];

@NgModule({
  imports:
    [
      RouterModule.forChild(routes)
    ],
  exports:
    [
      RouterModule
    ]
})
export class TabsPageRoutingModule {}