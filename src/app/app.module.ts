import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { DynamicComponent } from './shared/components/dynamic-component';

import { TestService } from './shared/services/test.service';

import { HomeComponent } from './home/home.component';
import { TestListComponent } from './test-list/test-list.component';
import { TestDetailsComponent } from './test-details/test-details.component';
import { AboutComponent } from './about/about.component';

import { BalanceTestComponent } from './tests/balance-test/balance-test.component';
import { GenericTestComponent } from './tests/generic-test/generic-test.component';

@NgModule({
  declarations: [
    AppComponent,

    HeaderComponent,
    FooterComponent,
    DynamicComponent,

    HomeComponent,
    AboutComponent,
    TestListComponent,
    TestDetailsComponent,
    BalanceTestComponent,
    GenericTestComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    MaterialModule.forRoot(),
    FlexLayoutModule.forRoot()
  ],
  providers: [
    TestService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

}
