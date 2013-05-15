function get_transformed_url(current_url){
    if (current_url.indexOf('?') > -1){
        var suffix = '&tfrm=4';
    } else {
        var suffix = '?tfrm=4';
    }
    new_url = current_url + suffix;
    return new_url;
}


chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.getCurrent(function(){
    	transformed_url = get_transformed_url(tab.url);
    	chrome.tabs.create({
        	url: transformed_url
    	});
    })
    
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
      chrome.browserAction.setBadgeText({text:""});
      chrome.browserAction.setBadgeBackgroundColor({color:"#999"});
      // how to fetch tab url using activeInfo.tabid
      chrome.tabs.get(activeInfo.tabId, function(tab){
        // get current url here
        transformed_url = get_transformed_url(tab.url);
        $.ajax({
          type: "HEAD",
          url: transformed_url, 
          success: function(response, status, xhr){ 
            var ct = xhr.getResponseHeader("content-type") || "";
            if (ct.indexOf('xml') > -1) {
              chrome.browserAction.setBadgeText({text:"+"});
              // console.log(tab.url);
            }
          }
        }); 
    });
});