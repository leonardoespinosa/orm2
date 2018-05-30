import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AccessService } from '../../services/access/access.service';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgbModule.forRoot()
    ],
    providers: [AccessService],
    declarations: [SidebarComponent,
        NavbarComponent,
        LayoutComponent],
    exports: [SidebarComponent,
        NavbarComponent,
        LayoutComponent]
})
export class NavigationModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NavigationModule
        };
    }
}
