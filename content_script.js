var _left = ($(document).width()-400)/2;
var inline_style =  "text-align:center;display:none;width: 400px; height: auto;"+ 
"padding:5px; background: #FFF;  border:4px #74A5E4 solid;"+ 
"position: fixed;margin: auto;top: 100px;   z-index: 999995; left:"+_left+"px ";  


var div = 
 "<div class='modalF9' style='"+inline_style+"'>"+
 "<div style='float:right; cursor:pointer; font-size:18px; font-weight:bold; color:#000' id='ff9'>X</div>"+
 "<div id='inner'></div> </div>"; 

var _backDiv = 
"<div class='backDiv' style=" +
"'position:fixed;width:100%;height:100%;top:0px;bottom:0px;left:0px;right:0px;display:none;background-color:rgba(0,0,0,0.6);z-index:999994'>"+
"</div>";

var save_to_drive_div = '<div style="display:block;padding:8px 0px;"><div id="savetodrive-div"></div></div>';
$(document).ready(function(){	
    load_script("https://apis.google.com/js/platform.js");
	var img_first = $('img').get(0);

    if($(img_first).attr('src') == $(location).attr('href') && document.location.hash == "#save_to_drive"){
		if (window.opener === null) return;
		$(img_first).before(save_to_drive_div);
        $('#savetodrive-div').text('Loading...');

        var _size = getSize($(img_first)); 
        $(img_first).after("<p>Size: "+_size+"</p>");

		var img_src = $(location).attr('href');
		var img_name = getImageName(img_src);//img_src.split('/').pop();

        var text = create_gapi(img_src, img_name, "Site_name");
        if(typeof gapi === "undefined") {
                setTimeout(function(){
                    create_script(text);
                },1000);
        }
        else {
            create_script(text);
        }
	}
	else {
		$('body').append(div);
		$('body').prepend(_backDiv);
	}
	
	$("#ff9, .backDiv").click(function(){
	$(".modalF9").fadeOut();
	$(".backDiv").hide();		
});



})


var clickedEl = null;
document.addEventListener("mousedown", function(event){
    if(event.button == 2) { 
        clickedEl = event.target;
    }
}, true);

window.___gcfg = {parsetags: 'explicit' };
	
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	
if (msg.action == 'open_dialog_box') {	
	$("#savetodrive-div").remove();		
	if(msg.value.indexOf('data:image/') > -1 ){
		alert("Cannot open this kind of image");
		return;
	};
	if( (isURL(msg.value) && msg.value.indexOf(document.origin) == -1) || document.location.host.indexOf('google') > -1){		
		window.open(msg.value+"#save_to_drive","Save to Google Drive","width=500,height=300");
	}
	else 
	{
		$("#savetodrive-div").remove();		
		if(msg.value == $(location).attr('href')){
			$(clickedEl).before(save_to_drive_div);			
		}
		else {			
		$(".backDiv").show();	
		$(".modalF9").show();	
		var _size = getSize($(clickedEl));
		var html = get_inner_content(msg.value,_size);
		$(".modalF9").find('#inner').html(html);
		}
		var img_src = msg.value;
		var img_name = getImageName(msg.value);
		var text = create_gapi(img_src,img_name,"Site_name");
		create_script(text); 
		
	}
		
}
})

function getImageName(name) {
	var img_name = name.split('/').pop();
	img_name = img_name.split('.').pop();
    img_name = img_name.replace("#save_to_drive","");
	return Date.now() + '.' + img_name;
}

function create_gapi(img_src,img_name,site_name){
	return "gapi.savetodrive.render('savetodrive-div', { src: '"+img_src+"', filename: '"+img_name+"',  sitename: '"+site_name+"'})";  
}

function create_script(text){
var script   = document.createElement("script");
script.type  = "text/javascript";
script.id = "gapi_script";
script.text = text;
document.body.appendChild(script);
document.getElementById('gapi_script').remove();
}

function load_script(src){

var script_url = document.createElement('script');
script_url.src = src;
script_url.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(script_url);

}

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ 
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ 
  '((\\d{1,3}\\.){3}\\d{1,3}))'+
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
  '(\\#[-a-z\\d_]*)?$','i');
  return pattern.test(str);
}

function get_inner_content(value,size){
	return "<h2 style='all: inherit;color:#000; font-size:18px;text-align:center;text-transform: none;font-family: Arial, Helvetica, sans-serif;font-weight: normal;'>Save to Google Drive</h2>"+
		"<img src='"+value+"' style='max-width:280px; border:1px solid red;border-radius:5px; padding: 3px; margin:8px 0px;'>"+
        "<p style='all: inherit;font-size:14px; margin:5px 0px;color: #000' align='center'>" +size+" </p>"+
		"<div style='display:block'>	<div id='savetodrive-div'></div></div>";
}

function getSize(img){
	var w = (typeof $(img).prop('naturalWidth') == "number") ? $(img).prop('naturalWidth')  : "";
	var h = (typeof $(img).prop('naturalHeight') == "number") ? $(img).prop('naturalHeight')  : "";
	return w+"&times;"+h;
}


