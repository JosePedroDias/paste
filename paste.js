(function(window) {

    'use strict';

    /*jshint browser:true, eqeqeq:true, undef:true, curly:true, laxbreak:true, forin:false, smarttabs:true */
    /*global console:false, Showdown:false */



    // relevant DOM elements
    var divEl = document.getElementsByTagName('div')[0];
    var taEl  = document.getElementsByTagName('textarea')[0];
    var btnEl = document.getElementsByTagName('button')[0];



    var src, markup, id, endpoint = 'storage.php';



    // converts source to markup
    var slashNRgx = /\n/g;
    var uriRgx = /(\S+:\/\/\S+)/g;
    var firstLineRgx = /^(.*)$/gm;

    var processDefault= function(src) {
        var res = src.replace(uriRgx, '<a href="$1">$1</a>');
        res = res.replace(slashNRgx, '<br/>');
        return ['<pre>', res, '</pre>'].join('');
    };

    var md = new Showdown.converter();
    var processMarkdown = function(src) {
        return md.makeHtml(src);
    };

    var formats = {
        md: processMarkdown
    };

    var processSource = function(src) {
        firstLineRgx.lastIndex = 0;
        var format = firstLineRgx.exec(src)[1] || '';

        var formatter = formats[format];

        var src2;
        if (formatter) {
            src2 = src.substring(format.length);
        }
        else {
            formatter = processDefault;
            src2 = src;
        }

        markup = formatter(src2);
        divEl.className = format;
        divEl.innerHTML = markup;
    };



    // AJAX POST implementation
    var post = function(uri, params, cb) {
        var r = new XMLHttpRequest();
        r.open('POST', uri, true);
        r.onreadystatechange = function () {
            if (r.readyState !== 4 || r.status !== 200) { return; }
            cb(null, r.responseText);
        };

        var v, qs = [];
        for (var k in params) {
            if (!params.hasOwnProperty(k)) { continue; }
            v = params[k];
            qs.push( [k, encodeURIComponent(v)].join('=') );
        }
        qs = qs.join('&');

        r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        r.send(qs);
    };



    // gets source from storage
    var getSource = function(id, cb) {
        post(endpoint, {op:'load', id:id}, function(err, o) {
            //console.log(err, o);
            cb(err, o);
        });
    };



    // saves source to storage
    var saveSource = function(id, src, cb) {
        post(endpoint, {op:'save', id:id, t:src}, function(err, o) {
            //console.log(err, o);
            cb(err || o);
        });
    };



    var sourceExists = function(id, cb) {
        post(endpoint, {op:'exists', id:id}, function(err, o) {
            //console.log(err, o);
            cb(null, o === 'true');
        });
    };



    // fetches/creates id, sets initial state
    var init = function() {
        id = window.location.hash ? window.location.hash.substring(1) : Math.floor(Math.random() * Math.pow(36, 4)).toString(36);
        if (!window.location.hash) { window.location.hash = id; }

        getSource(id, function(err, s) {
            if (err) {
                return console.log('error getting source for id ' + id);
            }
            src = s;
            taEl.value = src;
            processSource(src);
            document.title = 'paste - ' + id;
            btnEl.focus();
            /*console.log('got source:');
            console.log(src);*/
        });
    };
    init();



    var cmdEdit = function() {
        taEl.style.display = '';
            divEl.style.display = 'none';
            btnEl.innerHTML = 'save';
            taEl.focus();
    };

    var cmdSave = function(skipSwitch) {
        src = taEl.value;

        saveSource(id, src, function(err) {
            if (err) { return console.log('error saving source'); }
            if (!skipSwitch) {
                processSource(src);
                taEl.style.display = 'none';
                divEl.style.display = '';
                btnEl.innerHTML = 'edit';
            }
            console.log('saved source');
        });
    };

    var onBtnClick = function(ev) {
        var cmd = btnEl.innerHTML;
        if      (cmd === 'edit') { cmdEdit(); }
        else if (cmd === 'save') { cmdSave(); }
    };



    var onHashChange = function() {
        init();
    };

    var onKeyDown = function(ev) {
        if (ev.ctrlKey && ev.keyCode === 83) {
            ev.preventDefault();
            if (btnEl.innerHTML === 'save') { cmdSave(true); }
        }
    };

    btnEl.addEventListener('click',       onBtnClick);
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('keydown',    onKeyDown);

    // http://jakiestfu.github.io/Behave.js/ for indentation
    var editor = new Behave({
        textarea: document.querySelector('textarea')
    });

    //document.body.app

})(window, undefined);
