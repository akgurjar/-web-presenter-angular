import {
    Component,
    AfterContentInit,
    Input,
    HostBinding,
    HostListener,
    ViewChild,
    ContentChildren,
    ViewContainerRef,
    QueryList,
} from '@angular/core';

import { WPPage } from '../page/page';
import { WPDialog } from '../dialog/dialog';
import { PanelEvent } from '../panel/event';
import { WPStep } from '../step/step';
import { presentationMode, exitPresentationMode } from './presentation';
@Component({
    selector: 'wp-container',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class WPContainer implements AfterContentInit {
    isOverlay = true;
    currentPage: WPPage = null;
    currentPageTitle = null;
    currentPageIndex = 0;
    get isPageTitle (): boolean {
        if (this.currentPage && this.currentPage.label !== null) {
            return true;
        }
        return false;
    }
    @Input() label = 'Presentation';
    @Input() icon = null;

    @HostBinding('attr.tabindex') _tabindex = 0;
    @HostBinding('attr.data-target') _eventDetectingText = 'pce'; // page change event

    @ViewChild('page', { read: ViewContainerRef }) _container: ViewContainerRef;
    @ViewChild('overlay', { read: ViewContainerRef }) _overlay: ViewContainerRef;

    @ContentChildren(WPPage) _pages: QueryList<WPPage>;
    _pagesArray: WPPage[] = null;

    get hasPreviousPage(): boolean {
        return this.currentPageIndex !== 0;
    }
    get hasNextPage(): boolean {
        return this.currentPageIndex !== this._pages.length - 1;
    }
    get hasPreviousStep(): boolean {
        return this.currentPage.hasPreviousStep;
    }
    get hasNextStep(): boolean {
        return this.currentPage.hasNextStep;
    }
    isPanelVisible = false;
    isFullScreenMode = false;
    isPresentationMode = false;
    pageStates: PageState[] = [];
    constructor(public dialog: WPDialog) { }

    ngAfterContentInit () {
        this.dialog._setContainer(this._overlay);
        this._pages.notifyOnChanges();
        this._pagesArray = this._pages.toArray();
        this._pages.changes.subscribe(() => {
            if (this._pages.length > 0) {
                this._pagesArray = this._pages.toArray();
                const currentPageIndex = this._pagesArray.indexOf(this.currentPage);
                if (currentPageIndex !== -1) {
                    this.currentPageIndex = currentPageIndex;
                } else {
                    if (this.currentPageIndex < this._pagesArray.length) {
                        this.onChangePage(this._pagesArray[this.currentPageIndex > 0 ? this.currentPageIndex - 1 : this.currentPageIndex]);
                    } else {
                        this.onChangePage(this._pages.last);
                    }
                }
            }
        });
        if (this._pages.length > 0) {
            this.onChangePage(this._pages.first);
        }
    }

    @HostListener('keypress', ['$event'])
    onKeyPress(event: KeyboardEvent) {
        const target: HTMLElement = event.target as HTMLElement;
        if (target.getAttribute('data-target') === 'pce') { // page change event
            if (event.keyCode === 37) {
                if (event.ctrlKey) {
                    this.onPreviousPage();
                } else {
                    this.onPreviousStep();
                }

            } else if (event.keyCode === 39) {
                if (event.ctrlKey) {
                    this.onNextPage();
                } else {
                    this.onNextStep();
                }

            }
        }
    }
    onChangePage (page: WPPage) {
        if (page) {
            if (this.currentPage) {
                this.pageStates[this.currentPageIndex] = new PageState(this.currentPage);
                this.currentPage.markInactive();
            }
            this._container.clear();
            this.currentPage = page;
            this.currentPageIndex = this._pagesArray.indexOf(page);
            this.currentPageTitle = page.label;
            if (this.pageStates[this.currentPageIndex]) {
                this.currentPage.markActive(this.pageStates[this.currentPageIndex].activeStepIndex);
            } else {
                this.currentPage.markActive();
            }
            this._container.createEmbeddedView(page._template);
        }
    }
    onNextPage () {
        if (this.currentPage !== this._pages.last) {
            this.onChangePage(this._pagesArray[this.currentPageIndex + 1]);
        } else {
            console.log('It is last page already');
        }
    }
    onPreviousPage () {
        if (this.currentPage !== this._pages.first) {
            this.onChangePage(this._pagesArray[this.currentPageIndex - 1]);
        } else {
            console.log('It is first page already');
        }
    }
    onPreviousStep() {
        if (!this.currentPage.onPreviousStep()) {
            this.onPreviousPage();
        }
    }
    onNextStep() {
        if (!this.currentPage.onNextStep()) {
            this.onNextPage();
        }
    }
    onOverlayClicked () {
        if (this.dialog.activeDialog) {
            this.dialog.activeDialog.close();
        }
    }
    onMore() {
        this.isPanelVisible = true;
    }
    onPanelEvent(event: PanelEvent) {
        if (event.type === 'SCREEN') {
            this.isFullScreenMode = event.data;
        } else if (event.type === 'MODE') {
            this.isPresentationMode = event.data;
            if (event.data) {
                presentationMode(document.documentElement);
            } else {
                exitPresentationMode();
            }
        } else if (event.type === 'CLOSE') {
            this.isPanelVisible = event.data;
        } else if (event.type === 'STEP') {
            if (event.dir === 'PREVIOUS') {
                this.onPreviousStep();
            } else if (event.dir === 'NEXT') {
                this.onNextStep();
            }
        } else if (event.type === 'PAGE') {
            if (event.dir === 'PREVIOUS') {
                this.onPreviousPage();
            } else if (event.dir === 'NEXT') {
                this.onNextPage();
            }
        }
    }
}

export class PageState {
    activeStep: WPStep;
    activeStepIndex: number;
    constructor(page: WPPage) {
        this.activeStep = page.activeStep;
        this.activeStepIndex = page.activeStepIndex;
    }
}

