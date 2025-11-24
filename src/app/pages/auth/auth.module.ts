import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { StartOnboardingComponent } from './start-onboarding/start-onboarding.component';
import { NafathDialogComponent } from './nafath-dialog/nafath-dialog.component';

const routes: Routes = [
  { path: 'login', component: StartOnboardingComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    StartOnboardingComponent,
    NafathDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    NgbModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
