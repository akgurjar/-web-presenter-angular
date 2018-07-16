import {
    Component,
    ViewChild,
    ElementRef,
    HostListener,
    Renderer2
} from '@angular/core';

@Component({
    selector: 'button[wp-button]',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class WPButton {
    @ViewChild('ripple') ripple: ElementRef<HTMLDivElement> = null;
    rippleItem: HTMLSpanElement = null;
    constructor(
        public renderer: Renderer2
    ) { }
    @HostListener('mousedown', ['$event'])
    _onMouseDown(event: MouseEvent) {
        const data: ProcessedData = this._processData(event);
        const rippleItem: HTMLSpanElement = this.renderer.createElement('span');
        rippleItem.style.left = `${data.posX - 1}px`;
        rippleItem.style.top = `${data.posY - 1}px`;
        if (this.ripple) {
            this.renderer.appendChild(this.ripple.nativeElement, rippleItem);
            this.rippleItem = rippleItem;
            requestAnimationFrame(function(time) {
                rippleItem.setAttribute('data-animation', Date.now().toString());
                rippleItem.style.transform = `scale(${data.scale})`;
            });
        }
    }
    @HostListener('mouseup')
    _onMouseUp() {
        const target = this.rippleItem;
        if (target) {
            const duration = parseFloat(getComputedStyle(target)['transition-duration']) * 1000;
            const time = Date.now() - parseInt(target.getAttribute('data-animation'), 10);
            if (time > duration) {
                this.renderer.removeChild(this.ripple.nativeElement, target);
            } else {
                setTimeout(() => {
                    this.renderer.removeChild(this.ripple.nativeElement, target);
                }, duration - time);
            }
        }
    }

    private _processData(event: MouseEvent): ProcessedData {
        const posX = event.layerX,
        posY = event.layerY,
        target = this.ripple.nativeElement,
        height = target.clientHeight,
        width = target.clientWidth,
        maxX = (width / 2) < posX ? posX : width - posX,
        maxY = (height / 2) < posY ? posY : height - posY,
        scale = Math.ceil(Math.pow( Math.pow(maxX, 2) + Math.pow(maxY, 2), .5));
        return { posX, posY, scale };
    }
}

interface ProcessedData {
    posX: number;
    posY: number;
    scale: number;
}
