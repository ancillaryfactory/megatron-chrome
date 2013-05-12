chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.getCurrent(function(){
    	var current_url = tab.url;
    	if (current_url.indexOf('?') > -1){
    		var suffix = '&tfrm=4';
    	} else {
    		var suffix = '?tfrm=4';
    	}

    	var transformed_page = current_url + suffix;
    	
    	chrome.tabs.create({
        	url: transformed_page
    	});
    })
    
});