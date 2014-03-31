function RssObj(data) {
    this.Subject = $(data).find("title").text();
    this.Date = $(data).find("pubDate").text();
    this.Link = $(data).find("link").text();
}