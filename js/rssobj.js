function RssObj(data, tag) {
    this.tag = tag;
    this.title = $(data).find("title").first().text();
    if(tag == 'crunch') {
        console.log($(data).find("title"));
        console.log($(data).find("title").text());
    }
    this.date = Date.parse($(data).find("pubDate").text());
    this.link = $(data).find("link").text();
    try {
        this.description = $("<div/>").html($(data).find("description").text()).text();
    } catch(e) {
        this.description = $(data).find("description").text();
    }
}


if(!Date.prototype.toLocaleFormat){
    Date.prototype.toLocaleFormat = function(format) {
        var f = {
            Y : this.getFullYear(),
            y : this.getFullYear()-(this.getFullYear()>=2e3?2e3:1900),
            m : this.getMonth() + 1,
            d : this.getDate(),
            H : this.getHours(),
            M : this.getMinutes(),
            S : this.getSeconds()
        }, k;

        for(k in f)
            format = format.replace('%' + k, f[k] < 10 ? "0" + f[k] : f[k]);
        return format;
    }
}


RssObj.prototype.format = function() {
    //'<a class="pull-left" href="' + this.Link + '" target="_blank">' +
    //'<img class="media-object" src="' + this.Icon + '" alt="...">' +
    //'</a>' +
    var result = '<a href="' + this.link + '" class="list-group-item" target="_blank">' +
            '<h4 class="list-group-item-heading"><small>' + (new Date(this.date).toLocaleFormat("%d.%m.%Y")) + '</small> ' + this.title +
            '&nbsp;<span class="badge">' + this.tag + '</span>' +
            '</h4>';
    if(this.description != 'undefined' && this.description.length < 500 &&
        this.description.indexOf('<img') == -1 && this.description.indexOf('<iframe') == -1) {
        this.description = this.description.replace(/\<a.+\>/g, '');
        this.description = this.description.replace(/\<\\a\>/g, '');
        result += '<p class="list-group-item-text">' + this.description + '</p>';
    }

    result += '</div>';
    return result;
}