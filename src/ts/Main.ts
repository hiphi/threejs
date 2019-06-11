'use strict';

import SplineView from './view/SplineView';

class Main {

    public static Spline;

    public static onDomContentsLoaded(event:any = null) {
        Main.Spline = new SplineView.Spline();
    }
}

if (document.readyState !== 'loading') {
    Main.onDomContentsLoaded();
} else {
    document.addEventListener('DOMContentLoaded', Main.onDomContentsLoaded);
}
