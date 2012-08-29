(function(window) {
    
    'use strict';

    /*jshint browser:true, eqeqeq:true, undef:true, curly:true, laxbreak:true, forin:false, smarttabs:true */
    /*global console:false */



    // relevant DOM elements
    var divEl = document.getElementsByTagName('div')[0];
    var taEl  = document.getElementsByTagName('textarea')[0];
    var btnEl = document.getElementsByTagName('button')[0];



    var src, markup, id, endpoint = 'storage.php';



    // converts source to markup
    var slashNRgx = /\n/g;
    var uriRgx = /(\S+:\/\/\S+)/g;
    var processSource = function(src) {
        markup = src.replace(uriRgx, '<a href="$1">$1</a>');
        markup = markup.replace(slashNRgx, '<br/>');
        divEl.innerHTML = ['<pre>', markup, '</pre>'].join('');
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
            btnEl.focus();
            /*console.log('got source:');
            console.log(src);*/
        });
    };
    init();

    

    var onBtnClick = function(ev) {
        var cmd = btnEl.innerHTML;

        if (cmd === 'edit') {
            taEl.style.display = '';
            divEl.style.display = 'none';
            btnEl.innerHTML = 'save';
            taEl.focus();
        }
        else if (cmd === 'save') {
            src = taEl.value;
            
            saveSource(id, src, function(err) {
                if (err) {
                    return console.log('error saving source');
                }
                processSource(src);
                taEl.style.display = 'none';
                divEl.style.display = '';
                btnEl.innerHTML = 'edit';
                //console.log('saved source');
            });
        }
    };



    var onHashChange = function() {
        init();
    };



    btnEl.addEventListener('click',       onBtnClick);
    window.addEventListener('hashchange', onHashChange);
    
})(window, undefined);
