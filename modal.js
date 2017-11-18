function Modal() {
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

    this.el = document.querySelector('#modal');
}

Modal.prototype.init = function() {
    this.el.style.display = 'block';
}