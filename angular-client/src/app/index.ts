import { SigninComponent } from './components/access/signin/signin.component';
import { AccessService } from './services/access/access.service';
import { ViewProposalsComponent } from './components/contractor/view-proposals/view-proposals.component';
import { SupplierContractsComponent } from './components/contractor/supplier-contracts/supplier-contracts.component';

export const WEB_DECLARATIONS = [
    SigninComponent,
    ViewProposalsComponent,
    SupplierContractsComponent
];

export const SERVICES_DECLARATIONS = [
    AccessService
];