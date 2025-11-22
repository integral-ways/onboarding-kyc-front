import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { KycLayoutComponent } from './kyc-layout/kyc-layout.component';
import { PersonalInfoComponent } from './steps/personal-info/personal-info.component';
import { AddressInfoComponent } from './steps/address-info/address-info.component';
import { ContactInfoComponent } from './steps/contact-info/contact-info.component';
import { EmploymentInfoComponent } from './steps/employment-info/employment-info.component';
import { GeneralInfoComponent } from './steps/general-info/general-info.component';
import { FatcaInfoComponent } from './steps/fatca-info/fatca-info.component';
import { BankInfoComponent } from './steps/bank-info/bank-info.component';

const routes: Routes = [
  {
    path: '',
    component: KycLayoutComponent,
    children: [
      { path: '', redirectTo: 'personal-info', pathMatch: 'full' },
      { path: 'personal-info', component: PersonalInfoComponent },
      { path: 'address-info', component: AddressInfoComponent },
      { path: 'contact-info', component: ContactInfoComponent },
      { path: 'employment-info', component: EmploymentInfoComponent },
      { path: 'general-info', component: GeneralInfoComponent },
      { path: 'fatca-info', component: FatcaInfoComponent },
      { path: 'bank-info', component: BankInfoComponent }
    ]
  }
];

@NgModule({
  declarations: [
    KycLayoutComponent,
    PersonalInfoComponent,
    AddressInfoComponent,
    ContactInfoComponent,
    EmploymentInfoComponent,
    GeneralInfoComponent,
    FatcaInfoComponent,
    BankInfoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    NgbModule,
    RouterModule.forChild(routes)
  ]
})
export class KycModule { }
