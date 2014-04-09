
function RssClient() {
    this.queue = new Array();
    this.allNews = new Array();
    this.totalFeedCount = 0;
    this.currentFeed = 0;
}


RssClient.prototype.addFeed = function(url, tag) {
    if(jQuery.isArray(url)) {
        for(var idx in url) {
            this.queue.push({'url': url[idx], 'tag': tag[idx]});
            this.totalFeedCount++;
        }
    } else {
        this.queue.push({'url':url, 'tag':tag});
        this.totalFeedCount++;
    }
}

RssClient.prototype.loadAll = function(callback) {
    this.callback = callback;
    this.currentFeed = 0;
    this.allNews = [];

    if(typeof this.onprogress === 'function') {
        this.onprogress(2);
    }

    this.fetchNext();
}


RssClient.prototype.fetchNext = function() {
    var feed = this.queue[this.currentFeed++];

    var client = this;
    var tag = feed.tag;

    $.get(feed.url, function( data ) {
        if(typeof client.onprogress === 'function') {
            client.onprogress(100.0 * client.currentFeed / client.totalFeedCount);
        }

        var $xml = $(data);

        var items = $xml.find('channel > item');
        var result = new Array();
        $.each(items, function(index, value) {
            client.allNews.push(new RssObj(value, tag));
        });

        if(client.currentFeed < client.queue.length - 1) {
            client.fetchNext();
        } else {
            if(typeof client.onprogress === 'function') {
                client.onprogress(99.0);
            }

            client.allNews.sort(function(a, b){
                return b.date - a.date;
            });
            client.callback.call(null, client.allNews);
        }
    });
}


