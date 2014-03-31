function checkTopResponse(data) {
    // buggy, but fast and simple
//    return data.charAt(data.length - 1) == "\n";
    var end = data.substr(data.length - 3, 3);

//    console.log("end [" + end + "] = " + end.charCodeAt(0) + " " + end.charCodeAt(1) + " " + end.charCodeAt(2));

    return end == ".\r\n";
}

function checkOkResponse(data) {
    if(data.indexOf("+OK") == 0) {
        return true;
    }

    return false;
}

function checkCommonResponse(data) {
    return true;
}

var POP_COMMANDS = {
    USER : { name: "USER", param1:  true, param2: false, checkData: checkCommonResponse },
    PASS : { name: "PASS", param1:  true, param2: false, checkData: checkCommonResponse },
    STAT : { name: "STAT", param1: false, param2: false, checkData: checkCommonResponse },
    TOP  : { name: "TOP" , param1:  true, param2:  true, checkData: checkTopResponse    },
    LIST : { name: "LIST", param1:  true, param2: false, checkData: checkCommonResponse },
    RETR : { name: "RETR", param1:  true, param2: false, checkData: checkCommonResponse },
    NOOP : { name: "NOOP", param1: false, param2: false, checkData: checkCommonResponse },
    QUIT : { name: "QUIT", param1: false, param2: false, checkData: checkCommonResponse }
};


function Pop3Command(command, param1, param2, callback) {
    this.command = command;

    if(command.param1)
        this.param1 = param1;

    if(command.param2)
        this.param2 = param2;

    this.callback = callback;

    this.send = false;
    this.startReceive = false;
    this.error = false;
    this.needMoreData = false;
    this.data = '';
}

Pop3Command.prototype.formatCommand = function() {
    var ret = this.command.name;

    if(this.command.param1)
        ret += " " + this.param1;

    if(this.command.param2)
        ret += " " + this.param2;

    ret += "\n";

    return ret;
}

Pop3Command.prototype.onData = function(data) {
    if(this.error || !this.send) {
        return;
    }

    if(!this.startReceive) {
        if(checkOkResponse(data)) {
            this.startReceive = true;
        } else {
            this.error = true;
            return;
        }
    }

    if(this.command.checkData.call(null, data)) {
        this.needMoreData = false;
    } else {
//        console.log("Need more ...");
        this.needMoreData = true;
    }

    this.data += data;
}

Pop3Command.prototype.onReady = function() {
    if(typeof this.callback == 'function') {
        this.callback.call(null, this.data);
    }
}

Pop3Command.prototype.checkFinished = function() {
    return !this.needMoreData && !this.error && this.startReceive;
}