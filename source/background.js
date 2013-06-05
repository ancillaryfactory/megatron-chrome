var badgeColor = "#3cad3c";

function get_transformed_url(current_url){
    if (current_url.indexOf('?') > -1){
        var prefix = '&';
    } else {
        var prefix = '?';
    }
    new_url = current_url + prefix + 'tfrm=4';
    return new_url;
}

function get_transformed_content_type(transformed_url){
  $.ajax({
          type: "HEAD",
          url: transformed_url, 
          success: function(response, status, xhr){ 
            var ct = xhr.getResponseHeader("content-type") || "";
            if (ct.indexOf('xml') > -1) {
              chrome.browserAction.enable();
              chrome.browserAction.setBadgeText({text:"+"});
                $.ajax({
                  type: "GET",
                  url: transformed_url, 
                  success: function(data){ 
                    id = $(data).find('*').eq(0).attr('ID');
                    chrome.contextMenus.removeAll();
                    
                    if (typeof id != 'undefined'){
                      chrome.contextMenus.create({"title":id});
                      chrome.browserAction.setTitle({"title":id});
                    } else {
                      chrome.browserAction.setTitle({"title":""});
                    }
                  }
                }); 
            } else {
              chrome.browserAction.disable();
              chrome.contextMenus.removeAll();
            } // end check for xml response
          } // end success function
        }); 
}


// open new tab when the button is clicked
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.getCurrent(function(){
    	transformed_url = get_transformed_url(tab.url);
    	chrome.tabs.create({
        	url: transformed_url
    	});
    })
    
});

// check on pageload for XML
chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab) {
  chrome.browserAction.setBadgeBackgroundColor({color:badgeColor});
  chrome.browserAction.setBadgeText({text:""});
  transformed_url = get_transformed_url(tab.url);
  get_transformed_content_type(transformed_url);

});

// check the most recently activated tab for an XML response
// to the tfrm=4 querystring
chrome.tabs.onActivated.addListener(function(activeInfo) {
      chrome.browserAction.setBadgeText({text:""});
      chrome.browserAction.setBadgeBackgroundColor({color:badgeColor});
      // how to fetch tab url using activeInfo.tabid
      chrome.tabs.get(activeInfo.tabId, function(tab){
        // get current url here
        transformed_url = get_transformed_url(tab.url);
        get_transformed_content_type(transformed_url);
    });
});