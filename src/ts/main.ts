'use strict';

import view from 'view/Spline';

class Main {

    public static Spline;

    public static onDomContentsLoaded(event:any = null) {
        Main.Spline = new view.Spline();
    }
}

if (document.readyState !== 'loading') {
    Main.onDomContentsLoaded();
} else {
    document.addEventListener('DOMContentLoaded', Main.onDomContentsLoaded);
}