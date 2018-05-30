import { Route } from '@angular/router';
import { SigninComponent } from './components/access/signin/signin.component';
import { LayoutComponent } from './components/navigation/layout/layout.component';
import { ViewProposalsComponent } from './components/contractor/view-proposals/view-proposals.component';
import { SupplierContractsComponent } from './components/contractor/supplier-contracts/supplier-contracts.component';

export const routes: Route[] = [
    {
        path: 'portal', component: LayoutComponent, children: [
            { path: 'view-proposals', component: ViewProposalsComponent },
            { path: 'supplier-contracts', component: SupplierContractsComponent }
        ]
    },
    { path: '', component: SigninComponent }
];