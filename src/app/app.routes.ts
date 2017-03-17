import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TestListComponent } from './test-list/test-list.component';
import { TestDetailsComponent } from './test-details/test-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'tests', component: TestListComponent, children: [
  //   { path: ':id', component:  TestDetailsComponent }
  // ]},
  { path: 'home', component: HomeComponent },
  { path: 'tests', component: TestListComponent},
  { path: 'tests/:id', component:  TestDetailsComponent },
  { path: 'about', component: AboutComponent }

];

