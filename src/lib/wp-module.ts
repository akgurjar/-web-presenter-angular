import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WPContainer } from './container/container';
import { WPButton } from './button/button';
import { WPPanel } from './panel/panel';
import { WPPage } from './page/page';
import { WPStep } from './step/step';
import { WPDialog } from './dialog/dialog';

@NgModule({
    declarations: [
        WPContainer,
        WPPage,
        WPStep,
        WPButton,
        WPPanel
    ],
    imports: [
        CommonModule
    ],
    exports: [
        WPContainer,
        WPPage,
        WPStep
    ],
    providers: [ WPDialog ]
})
export class WPModule {
    constructor() {
        console.log('wp initiated');
    }
}


