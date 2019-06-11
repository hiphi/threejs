'use strict';

namespace SplineView {

    export class Spline {
        constructor() {
            console.log('Spline construct');
            this.init();
        }
        protected init():void {
            const tag = jQuery('<div id="mapViewer"></div>');
            //const tgt = $('body').append(tag);
            tag.stop(false,true).animate({left:'100px'},500,'easeOutSine');
        }
    }
}

export default SplineView;