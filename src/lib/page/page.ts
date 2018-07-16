import {
    Component,
    Input,
    ViewChild,
    ContentChildren,
    TemplateRef,
    QueryList,
    AfterContentInit
} from '@angular/core';
import { WPStep } from '../step/step';

@Component({
    selector: 'wp-page',
    template: `
        <ng-template>
            <ng-content></ng-content>
        </ng-template>
	`
})
export class WPPage implements AfterContentInit {
    @Input() label = null;
    @ViewChild(TemplateRef) _template: TemplateRef<any>;
    @ContentChildren(WPStep) _steps: QueryList<WPStep>;
    activeStepIndex = null;
    activeStep: WPStep = null;
    constructor() { }
    ngAfterContentInit() {}
    get hasPreviousStep(): boolean {
        return this.activeStepIndex !== null && this.activeStepIndex > 0;
    }
    get hasNextStep(): boolean {
        return this.activeStepIndex !== null && this.activeStepIndex < (this._steps.length - 1);
    }
    markActive(index?: number) {
        if (index && index < this._steps.length) {
            this.activeStepIndex = index;
            this.activeStep = this._steps.find((step, i) => i === index);
            this.activeStep.markActive();
        } else if (!index && this._steps.length > 0) {
            this.activeStep = this._steps.first;
            this.activeStepIndex = 0;
            this.activeStep.markActive();
        }
    }
    markInactive() {
        if (this.activeStep) {
            this.activeStep.markInactive();
            this.activeStepIndex = null;
            this.activeStep = null;
        }
    }
    onNextStep() {
        if (this.activeStepIndex !== null && this.activeStep && this.activeStepIndex < this._steps.length - 1) {
            this.activeStep.markInactive();
            this.activeStep = this._steps.find((_step, index) => index === this.activeStepIndex + 1);
            this.activeStep.markActive();
            this.activeStepIndex++;
            return true;
        }
        return false;
    }
    onPreviousStep() {
        if (this.activeStepIndex !== null && this.activeStep && this.activeStepIndex !== 0) {
            this.activeStep.markInactive();
            this.activeStep = this._steps.find((_step, index) => index === this.activeStepIndex - 1);
            this.activeStep.markActive();
            this.activeStepIndex--;
            return true;
        }
        return false;
    }
}
