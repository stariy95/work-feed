
function RssClient(feedUrl, callback) {
    var client = this;

    $.get(feedUrl, function( data ) {
        var $xml = $(data);

        client.channelTitle = $xml.find('channel > title').text();

        var items = $xml.find('channel > item');
        var result = new Array();
        $.each(items, function(index, value) {
            result.push(new RssObj(value));
        });

        callback.call(null, result);
    });
}