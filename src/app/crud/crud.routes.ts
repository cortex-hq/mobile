import { RouterModule, Routes, Router } from '@angular/router';
import { NgModule } from '@angular/core';

import { SportallComponent } from './sport/sport-all.component';
import { SportcreateComponent } from './sport/sport-create.component';
import { SportupdateComponent } from './sport/sport-update.component';
import { SportdeleteComponent } from './sport/sport-delete.component';

export const routes: Routes = [
  { path: 'sports', component: SportallComponent, data: { navigable: true, title: 'Sport', weight: 100 }},
  { path: 'sports/create', component: SportcreateComponent },
  { path: 'sports/:id', component: SportupdateComponent },
  { path: 'sports/delete/:id', component: SportdeleteComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CrudRouteModule {
}
