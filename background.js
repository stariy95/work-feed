chrome.app.runtime.onLaunched.addListener(function() {

    chrome.app.window.create(
        'html/rss.html',
        {},
        function(createdWindow){
            createdWindow.maximize();
        }
    );

  /*
  'bounds': {
        'width': 800,
        'height': 600
      }
  */
});
