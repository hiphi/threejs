'use strict';

namespace view {

    export class Spline {
        constructor() {
            console.log('MapView construct');
            this.init();
        }
        protected init():void {
            const tag = jQuery('<div id="mapViewer"></div>');
            var tgt = $('body').append(tag);
            tag.stop(false,true).animate({left:'100px'},500,'easeOutSine');
        }
    }
}

export default view;