import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[wpStep]'
})
export class WPStep {
    @Input() wpStep: string;
    constructor(
        private _elRef: ElementRef,
        private _renderer: Renderer2
    ) {}
    markActive() {
        this._renderer.addClass(this._elRef.nativeElement, this.wpStep);
    }
    markInactive() {
        this._renderer.removeClass(this._elRef.nativeElement, this.wpStep);
    }
}


