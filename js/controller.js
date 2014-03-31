var socketId = -1;

$(document).ready(function() {

    var rssClient = new RssClient("http://app2top.ru/feed", function(elements){
        $('#leftDiv').append('<h2>' + rssClient.channelTitle + '</h2>');
        $.each(elements, function( index, value ) {
            $('#leftDiv').append('<h3>' + value.Subject + '</h3>');
        });
    });

    var pop3Client = new Pop3Client();

    pop3Client.connect("", 110, "", "", function() {
        $('#leftDiv').prepend("<h2>Total emails: " + pop3Client.getTotalEmails() + "</h2>");

        for(var i=0; i<20; i++) {
            pop3Client.top(pop3Client.getTotalEmails() - i, newMail);
        }

        pop3Client.close();
    });
});

function newMail(data) {
    var mail = new MailObj(data);
    $('#leftDiv').prepend("<h3>" + mail.From + " &gt " + mail.Subject + "</h3>");
}

chrome.runtime.onSuspend.addListener(function() {
    //pop3Client.close();
});





