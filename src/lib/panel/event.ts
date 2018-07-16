
export type PanelEventType = 'SCREEN' | 'PAGE' | 'STEP' | 'MODE' | 'CLOSE';

export class PanelEvent {
    constructor(
        public type: PanelEventType,
        public data?: boolean,
        public dir?: 'PREVIOUS' | 'NEXT'
    ) {}
}
