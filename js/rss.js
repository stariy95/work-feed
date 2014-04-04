
function RssClient() {
    this.queue = new Array();
    this.allNews = new Array();
}


RssClient.prototype.addFeed = function(url, tag) {
    if(jQuery.isArray(url)) {
        for(var idx in url) {
            this.queue.push({'url': url[idx], 'tag': tag[idx]});
        }
    } else {
        this.queue.push({'url':url, 'tag':tag});
    }
}

RssClient.prototype.loadAll = function(callback) {
    this.callback = callback;
    this.fetchNext();
}


RssClient.prototype.fetchNext = function() {
    var feed = this.queue.pop();

    var client = this;
    var tag = feed.tag;

    $.get(feed.url, function( data ) {
        var $xml = $(data);

        var items = $xml.find('channel > item');
        var result = new Array();
        $.each(items, function(index, value) {
            client.allNews.push(new RssObj(value, tag));
        });

        if(client.queue.length > 0) {
            client.fetchNext();
        } else {
            client.allNews.sort(function(a, b){
                return b.date - a.date;
            });
            client.callback.call(null, client.allNews);
        }
    });
}


