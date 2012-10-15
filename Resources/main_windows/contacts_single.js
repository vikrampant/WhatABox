var win = Ti.UI.currentWindow;

Ti.API.info('*** contacts_single.js');
Ti.API.info('*** contacts_single.js - folder_id = ' + win.folder_id);

var scrolly = Titanium.UI.createScrollView({
	contentHeight:'auto',
	top:10,
	height:300
	});
win.add(scrolly);

var labelMessage = Titanium.UI.createLabel({
	top:10,
	width:300,
	height:40,
	id:'label_message',
	text:'Enter message to send along with invite :',
	color:'#ffffff'
});
scrolly.add(labelMessage);

// TODO: Insert textbox here for message, top:50, height:70
var ta1 = Titanium.UI.createTextArea({
	editable: true,
	value:'',
	height:100,
	width:300,
	top:50,
	font:{fontSize:20,fontWeight:'bold'},
	color:'#888',
	textAlign:'left',
	borderWidth:2,
	borderColor:'#bbb',
	borderRadius:5,
	suppressReturn:true
	
});
scrolly.add(ta1);

var labelName = Titanium.UI.createLabel({
	top:160,
	width:300,
	height:50,
	id:'label_name',
	text:'Choose which of ' + win.fullname + "'" + 's E-mail address to share your WaB with:',
	color:'#ffffff'
});
scrolly.add(labelName);

var buttons = new Array();

var i = 0;
while(i<win.arrayOfEmails.length){
	
	// http://developer.appcelerator.com/question/84241/dynamically-assign-listener-to-button
	buttons[i] = Ti.UI.createButton({
		title: win.arrayOfEmails[i].split('|')[1],
		height:40,
		width:300,
		top:210 + (i*50),
	    email:win.arrayOfEmails[i].split('|')[1]
	});
	
	buttons[i].addEventListener('click',function(e)
	{ 
	    var emailAddress = e.source.email;
	    Ti.API.info('here - ' + emailAddress);    
		
		var xhr = Titanium.Network.createHTTPClient();
		xhr.autoEncodeUrl = true;
		xhr.onload = function()
		{		
			if(this.responseXML.documentElement != null)
			{
				var doc = this.responseXML.documentElement; // Give me a xml document.
		  		var status = doc.getElementsByTagName("status").item(0).text;
				if(status == 'share_ok')
				{
					Ti.API.info('ok');
					Ti.App.fireEvent('openMyWabsPostShare', {});
				}
				else if(status == 'not_logged_in')
				{
				}
				else if(status == 'application_restricted')
				{
				}
				else if(status == 'wrong_node')
				{
				}
				else if(status == 'application_restricted')
				{
				}
				else if(status == 'share_error')
				{
				}
			}
			
		};
		
		// open the client and encode our URL
		Ti.API.info('https://www.box.net/api/1.0/rest?action=public_share&api_key=[INSERTAPIKEY]&auth_token='+ Ti.App.Properties.getString('auth_token') +'&target=folder&target_id='+win.folder_id+'&password=&message='+ta1.value+'&emails[]='+emailAddress);
		xhr.open('GET','https://www.box.net/api/1.0/rest?action=public_share&api_key=[INSERTAPIKEY]&auth_token='+ Ti.App.Properties.getString('auth_token') +'&target=folder&target_id='+win.folder_id+'&password=&message='+ta1.value+'&emails[]='+emailAddress);
		
		// https://www.box.net/api/1.0/rest?action=public_share&api_key=rrc1d3ntb53tt6b2vhail6rdtrsxov3v&auth_token=rpuis3lincpbyz60gyym8s3xhnc6gbcl&target=folder&target_id=709&password=&message=hey&emails[]=email@example.com&emails[]=email2@example.com
	
		// send the data
		xhr.send();	

	});	
	
	i++;

}
scrolly.add(buttons);