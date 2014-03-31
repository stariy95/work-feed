function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function bind(toObject, methodName){
    return function(param){toObject[methodName](param)}
}

function Pop3Client() {
    this.queue = new Array();
    this.socketId = -1;
    this.user = '';
    this.pass = '';
    this.waiting = true;
    this.ready = false;
    this.lastCommand = 'undefined';
}

Pop3Client.prototype.connect = function(host, port, user, pass, callback) {
     var client = this;
     this.host = host;
     this.port = port;
     this.user = user;
     this.pass = pass;
     this.callback = callback;

     chrome.sockets.tcp.create({bufferSize: 4096}, function(createInfo) {
         client.socketId = createInfo.socketId;
         chrome.sockets.tcp.connect(client.socketId, host, port, bind(client, 'onConnect'));
     });
 }

Pop3Client.prototype.onConnect = function(result) {
    if(result < 0) {
         console.log("Unable to connect " + result);
         return;
    }

    chrome.sockets.tcp.onReceive.addListener(bind(this, 'onReceive'));
    chrome.sockets.tcp.onReceiveError.addListener(bind(this, 'onReceiveError'));

    this.sendCommand(new Pop3Command(POP_COMMANDS.USER, this.user));
    this.sendCommand(new Pop3Command(POP_COMMANDS.PASS, this.pass));

    var client = this;
    this.stat(function(total, size) {
//        console.log("Total emails " + total + " of size " + size);
        client.totalEmails = total;
        client.callback.call();
    });


//    this.sendCommand("LIST 18249\n");
//    this.sendCommand("NOOP\n");
//    this.sendCommand("TOP 18249 0\n");
//    this.sendCommand("NOOP\n");
//    this.sendCommand("QUIT\n");
}

Pop3Client.prototype.getTotalEmails = function() {
    return this.totalEmails;
}

Pop3Client.prototype.stat = function(callback) {
    this.sendCommand(new Pop3Command(POP_COMMANDS.STAT, null, null, function(data){
        var arr = data.split(" ");
        callback.call(null, arr[1], arr[2]);
    }));
}

Pop3Client.prototype.top = function(email, callback) {
    this.sendCommand(new Pop3Command(POP_COMMANDS.TOP, email, 0, function(data){
        callback.call(null, data);
    }));
}

Pop3Client.prototype.sendCommand = function(command) {
    if(this.waiting) {
        this.queue.push(command);
    } else {
        this.lastCommand = command;
        this.waiting = true;
//        console.log("Send " + command.formatCommand());
        chrome.sockets.tcp.send(this.socketId, str2ab(command.formatCommand()), bind(this, 'onSend'));
    }
}

Pop3Client.prototype.onSend = function(result) {
    if(result.resultCode != 0) {
        console.log("onSend() resultCode: " + result.resultCode + " bytesSent: " + result.bytesSent);
        return;
    }

    this.lastCommand.send = true;
}


Pop3Client.prototype.pushQueue = function() {
    this.waiting = false;
    if(this.queue.length > 0) {
        this.sendCommand(this.queue.shift());
    }
}

Pop3Client.prototype.onReceive = function(info) {
    if(info.socketId != this.socketId) {
        return;
    }

    var data = ab2str(info.data);
//    console.log("Receive " + data);

    if(this.lastCommand == 'undefined') {
        if(!checkOkResponse(data)) {
            console.log("Unable to connect to server " + this.host + ":" + this.port);
        } else {
            this.pushQueue();
        }
        return;
    }

    this.lastCommand.onData(data);
    if(this.lastCommand.checkFinished()) {
        this.lastCommand.onReady();
        this.pushQueue();
    }
}

Pop3Client.prototype.onReceiveError = function(info) {
    if(info.socketId != this.socketId) {
        return;
    }

    console.log("onReceiveError()" + " socketId: " + info.socketId + " resultCode: " + info.resultCode);
    this.pushQueue();
}

Pop3Client.prototype.close = function() {
    this.sendCommand(new Pop3Command(POP_COMMANDS.QUIT, null, null, function(data) {
        if(this.socketId != -1) {
            chrome.sockets.tcp.close(this.socketId, function(){});
            this.socketId = -1;
        }
    }));
}