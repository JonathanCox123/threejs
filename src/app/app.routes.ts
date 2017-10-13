import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SampleComponent} from './SampleComponent/sample.component';
import {SoundTestComponent} from './SoundTestComponent/sound.component';

const APP_ROUTES: Routes = [
    {path: '', component: SampleComponent, pathMatch: 'full'},
    {path: 'sound', component: SoundTestComponent, pathMatch: 'full'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);