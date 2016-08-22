'use strict';

var Poller = require('./poller');

module.exports = PollService;

function PollService() {
    this.pollerMap = {};
    this.state = 'stop';
}

PollService.prototype.startService = function () {
    for (var key in this.pollerMap) {
        if (this.pollerMap.hasOwnProperty(key)) {
            this.pollerMap[key].startPolling();
        }
    }
};

PollService.prototype.addWatchingPage = function (pageId) {
    var poller = new Poller(pageId, 5);
    poller.url = 'http://cloudclip.perqin.com/?pid=[[PAGEID]]';
    if (this.state === 'start') {
        poller.startPolling();
    }
    this.pollerMap[pageId] = poller;
};
