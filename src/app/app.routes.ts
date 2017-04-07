import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TestListComponent } from './test-list/test-list.component';
import { TestDetailsComponent } from './test-details/test-details.component';

// import { SportallComponent } from './crud/sport/sport-all.component';
// import { SportcreateComponent } from './crud/sport/sport-create.component';
// import { SportupdateComponent } from './crud/sport/sport-update.component';
// import { SportdeleteComponent } from './crud/sport/sport-delete.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'tests', component: TestListComponent, children: [
  //   { path: ':id', component:  TestDetailsComponent }
  // ]},
  { path: 'home', component: HomeComponent, data: { navigable: true, title: 'Home', weight: 0 }},
  { path: 'tests', component: TestListComponent, data: { navigable: true, title: 'Test', weight: 10 }},
  { path: 'tests/:id', component:  TestDetailsComponent },
  { path: 'about', component: AboutComponent, data: { navigable: true, title: 'About', weight: 1000 }},
  // { path: 'sports', component: SportallComponent },
  // { path: 'sports/create', component: SportcreateComponent },
  // { path: 'sports/:id', component: SportupdateComponent },
  // { path: 'sports/delete/:id', component: SportdeleteComponent },

];

