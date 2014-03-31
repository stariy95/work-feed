
function decodeStr(str) {
    var m = str.match(/=[a-zA-Z0-9\?\-\+\=\/]+=/);
    if(m) {
        var arr = m[0].split('?');
        if(!arr[3]) {
            console.log(str);
            console.log(arr);
            return str;
        }
        arr[3] = arr[3].replace(/\=/g, '');
//        console.log(arr);

        var text = window.atob(arr[3]);
        try {
            text = decodeURIComponent(escape(text));
        } catch(ex) {
        }
        str = str.replace(m[0], text);
    }
//    console.log(m);
    return str;
}

function MailObj(data) {
    var headersRaw = data.split("\n");
    var headers = new Array();
    var lastHeader = -1;

    for(var i in headersRaw) {
        if(headersRaw[i].length == 0 ||
            headersRaw[i].charAt(0) == '+' ||
            headersRaw[i].charAt(0) == "\r" ||
            headersRaw[i].charAt(0) == "\n" ||
            headersRaw[i].charAt(0) == ".") {
            continue;
        }

        if(headersRaw[i].charCodeAt(0) == 9 || headersRaw[i].charAt(0) == ' ') { // TAB
            if(lastHeader != -1)
                headers[lastHeader]['value'] += headersRaw[i].trim();
            continue;
        }

        lastHeader++;

        var h = headersRaw[i].split(':');
        headers[lastHeader] = {};
        headers[lastHeader].name = h[0].trim();
        if(typeof h[1] == 'string') {
            headers[lastHeader].value = h[1].trim();
        } else {
//            console.log(headersRaw[i]);
            headers[lastHeader].value = '';
        }
    }

    // From
    // To
    // Date
    // Subject
    var neededHeaders = ['From', 'To', 'Date', 'Subject'];

    for(var i in headers) {
        if(jQuery.inArray(headers[i].name, neededHeaders) > -1){
            this[headers[i].name] = decodeStr(headers[i].value);
            console.log(i + " > " + headers[i].name + ": " + decodeStr(headers[i].value));
        }
    }
}