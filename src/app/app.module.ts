import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SoundTestComponent } from './SoundTestComponent/sound.component';
import { SampleComponent } from './SampleComponent/sample.component';

// Routing
import {routing} from './app.routes';

@NgModule({
  declarations: [
      AppComponent,
      SampleComponent,
      SoundTestComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [
      AppComponent,
  ]
})
export class AppModule { }
