var socketId = -1;

$(document).ready(function() {

    var rssClient = new RssClient();

    rssClient.addFeed("http://app2top.ru/feed", 'app2top');
    rssClient.addFeed("http://apps4all.ru/rss", 'apps4all');
    rssClient.addFeed("http://apptractor.ru/feed", 'apptractor');
    rssClient.addFeed("http://d3.ru/rss/new?threshold=disabled", 'd3');
    rssClient.addFeed("http://habrahabr.ru/rss/best/", 'habr');
    rssClient.addFeed("http://roem.ru/rss/group/insides/", 'roem');

    rssClient.loadAll(function(data) {
        $.each(data, function( index, value ) {
            var html = value.format();
            $('#leftDiv').append(html);
        });
    });

    /*var pop3Client = new Pop3Client();

    pop3Client.connect("host", 110, "email", "password", function() {
        $('#leftDiv').prepend("<h2>Total emails: " + pop3Client.getTotalEmails() + "</h2>");

        for(var i=0; i<20; i++) {
            pop3Client.top(pop3Client.getTotalEmails() - i, newMail);
        }

        pop3Client.close();
    });
    */
});

function newMail(data) {
    var mail = new MailObj(data);
    $('#leftDiv').prepend("<h3>" + mail.From + " &gt " + mail.Subject + "</h3>");
}

chrome.runtime.onSuspend.addListener(function() {
    //pop3Client.close();
});





