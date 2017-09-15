var options = {
	"title": "Save to Drive",
	"contexts": ["image"],
	"onclick" : onClickHandler 
	};
var cid = chrome.contextMenus.create(options);


function onClickHandler(info, tab) {
		
var url = info.srcUrl;
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){

chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box",value : url}, function(response) {});  
});


};
