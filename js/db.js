
function dbConnector(name, version, callback) {
    this.version = version;
    this.table = 'rss_feeds';

    var request = indexedDB.open(name, version);
    var connector = this;

    request.onsuccess = function(event) {
        console.log("request.onsuccess");
        connector.db = request.result;
        console.log(connector.db);
        connector.loadAllRssFeed(callback);
    };

    request.onupgradeneeded = function(event) {
        console.log("request.onupgradeneeded");
        connector.db = event.target.result;
        console.log(connector.db);

        var objectStore = connector.db.createObjectStore(connector.table, { keyPath: "tag" });
        objectStore.createIndex("url", "url", { unique: true });

        console.log(objectStore);
    }

    request.onerror = function(e){
        console.log("request.onerror");
        connector.onError(e)
    };
}


dbConnector.prototype.addRssFeed = function(url, tag) {
    var connector = this;

    var trans = this.db.transaction([this.table], "readwrite");
    var store = trans.objectStore(this.table);

    var request = store.put({
        "url": url,
        "tag" : tag
    });

    request.onsuccess = function(e) {};
    request.onerror = function(e){connector.onError(e)};
}

dbConnector.prototype.deleteRssFeed = function(id) {
    var connector = this;

    var trans = this.db.transaction([this.table], "readwrite");
    var store = trans.objectStore(this.table);

    var request = store.delete(id);

    request.onsuccess = function(e) {};
    request.onerror = function(e) {connector.onError(e)};
}

dbConnector.prototype.loadAllRssFeed = function(callback) {
    var connector = this;

    console.log(this.db);
    var trans = this.db.transaction([this.table], "readwrite");
    var store = trans.objectStore(this.table);

    var cursorRequest = store.openCursor(IDBKeyRange.lowerBound(0));

    var resultSet = new Array();

    cursorRequest.onsuccess = function(e) {
        var result = e.target.result;
        if(!!result == false) {
            callback.call(null, resultSet);
            return;
        }

        resultSet.push(result.value);
        result.continue();
    };

    cursorRequest.onerror = function(e){connector.onError(e)};
}

dbConnector.prototype.onError = function(e) {
    console.log("SQL error: ");
    console.log(e);
}

dbConnector.prototype.onSuccess = function(tx, r) {
    console.log("OK");
}