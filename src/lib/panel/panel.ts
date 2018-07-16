import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PanelEventType, PanelEvent } from './event';

declare const document: Document;

@Component({
    selector: 'wp-panel',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class WPPanel {
    @Input() isFullScreenMode = false;
    @Input() isPresentationMode = false;
    @Input() isPanelVisible = false;
    @Input() currentPage = null;
    @Input() hasPreviousStep = false;
    @Input() hasPreviousPage = false;
    @Input() hasNextStep = false;
    @Input() hasNextPage = false;
    @Output() event: EventEmitter<PanelEvent> = new EventEmitter();
    constructor() {
        const panelEvent = this.onPanelEvent.bind(this);
        [
            'fullscreenchange',
            'mozfullscreenchange',
            'webkitfullscreenchange',
            'msfullscreenchange'
        ].forEach(function(event) {
            document.addEventListener(event, function() {
                const el = document['fullScreenElement']
                        || document['webkitFullScreenElement']
                        || document['mozFullScreenElement']
                        || document['msFullScreenElement'];
                if (!el) {
                    panelEvent('MODE', false);
                }
            }, false);
        });
    }
    onPanelEvent(type: PanelEventType, data?: any, dir?: any) {
        this.event.next(new PanelEvent(type, data, dir));
    }
}


