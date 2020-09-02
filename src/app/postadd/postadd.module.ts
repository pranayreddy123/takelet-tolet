import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { PostaddPageRoutingModule } from './postadd-routing.module';

import { PostaddPage } from './postadd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    PostaddPageRoutingModule
  ],
  declarations: [PostaddPage]
})
export class PostaddPageModule {}
