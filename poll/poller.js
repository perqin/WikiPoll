'use strict';

var http = require('http');

module.exports = Poller;

function Poller(pageId, interval, url) {
    this.url = url || 'http://my.ss.sysu.edu.cn/wiki/pages/viewpreviousversions.action?pageId=[[PAGEID]]';
    this.pageId = pageId;
    this.interval = interval || 30;
    this.worker = null;
    this.session = null;
}

Poller.prototype.makeLogin = function () {
    var options = {
        host: 'my.ss.sysu.edu.cn',
        path: '',
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
        }
    };
    http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log(chunk);
            // TODO: Parse and update session
        });
        response.on('error', console.error);
    }).end();
};

Poller.prototype.makeUpdateCheck = function (callback) {
    var bindedCallback = callback.bind(this);
    // FIXME: Parse host and path from URL
    var options = {
        host: 'my.ss.sysu.edu.cn',
        path: '/wiki/pages/viewpreviousversions.action?pageId=[[PAGEID]]'.replace(/\[\[PAGEID]]/g, this.pageId),
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
        }
    };
    http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log(chunk);
            // TODO: Parse
            bindedCallback(null, false, chunk);
        });
        response.on('error', function (err) {
            bindedCallback(err);
        });
    }).end();
};

Poller.prototype.startPolling = function () {
    // TODO: Change interval unit back to minute
    this.worker = setInterval(this.poll.bind(this), this.interval * 1000);
};

Poller.prototype.poll = function () {
    this.makeUpdateCheck(function (err, needLogin, updateInfo) {
        if (err) throw err;
        if (needLogin) {
            this.makeLogin();
        } else {
            // TODO: Notify
            console.log(updateInfo);
        }
    });
};

Poller.prototype.stopPolling = function () {
    clearInterval(this.worker);
};
