var socketId = -1;

$(document).ready(function() {

    var rssClient = new RssClient();

    rssClient.onprogress = function(progress) {
        $('#rss-load-progress').css('width', progress + '%');
    }

    function reloadRssContent() {
        $('#rss-load-progress-container').show();
        $('#rss-load-progress').css('width', '0%');

        rssClient.loadAll(function(data) {
            $('#rss-load-progress-container').hide();
            $('#feed-content').html('&nbsp;');
            $.each(data, function( index, value ) {
                var html = value.format();
                $('#feed-content').append(html);
            });
        });
    }

//    rssClient.addFeed("http://app2top.ru/feed", 'app2top');
//    rssClient.addFeed("http://apps4all.ru/rss", 'apps4all');
//    rssClient.addFeed("http://apptractor.ru/feed", 'apptractor');
//    rssClient.addFeed("http://d3.ru/rss/new?threshold=disabled", 'd3');
//    rssClient.addFeed("http://habrahabr.ru/rss/best/", 'habr');
//    rssClient.addFeed("http://roem.ru/rss/group/insides/", 'roem');

    var db = new dbConnector('work-feed', 2,
        function(res){
            for (var i in res) {
                $('#rss-list').append('<li><a href="#">' + res[i].tag + '</a></li>');
                rssClient.addFeed(res[i].url, res[i].tag);
            }
            reloadRssContent();
        }
    );

    $('#rss-add-submit').click(function() {
        var url = $('#inputUrl').val();
        var tag = $('#inputTag').val();

        db.addRssFeed(url, tag);
        $('#rss-list').append('<li><a href="#">' + tag + '</a></li>');
        $('#rssModal').modal('hide');

        rssClient.addFeed(url, tag);
        reloadRssContent();
    });

    $('#btn-reload-rss').click(reloadRssContent);


    /*var pop3Client = new Pop3Client();
    pop3Client.connect("host", 110, "email", "password", function() {
        $('#leftDiv').prepend("<h2>Total emails: " + pop3Client.getTotalEmails() + "</h2>");
        for(var i=0; i<20; i++) {
            pop3Client.top(pop3Client.getTotalEmails() - i, newMail);
        }
        pop3Client.close();
    });
    function newMail(data) {
        var mail = new MailObj(data);
        $('#feed-content').prepend("<h3>" + mail.From + " &gt " + mail.Subject + "</h3>");
    }*/
});

chrome.runtime.onSuspend.addListener(function() {
    //pop3Client.close();
});





