
const doc = document.documentElement;

const fullScreen = doc['requestFullScreen']
                || doc['webkitRequestFullScreen']
                || doc['mozRequestFullScreen']
                || doc['msRequestFullScreen'];

const exitScreen = document['cancelFullScreen']
                || document['webkitCancelFullScreen']
                || document['mozCancelFullScreen']
                || document['msCancelFullScreen'];

export function presentationMode(el: HTMLElement) {
    fullScreen.call(el);
}

export function exitPresentationMode() {
    exitScreen();
}

