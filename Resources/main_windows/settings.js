var win 			= Ti.UI.currentWindow;

Ti.API.info('*** settings.js');

var buttonLogin = Titanium.UI.createButton({
	title:'Login to Box.net',
	top: 30,
	width:300,
	height: 40
});
win.add(buttonLogin);

var closeModalButton = Titanium.UI.createButton({
	image:'../images/button_closeModal.gif',
	top:5,
	left:240
});
win.add(closeModalButton);
closeModalButton.hide()


var webview = Titanium.UI.createWebView({
	top:30,
	width:320, 
	height:300, 
	canGoBack:false, 
	canGoForward:false,
	scalesPageToFit:true
	});
	
var labelClose = Titanium.UI.createLabel({
	top:330,
	width:300,
	height:50,
	id:'label_close_modal',
	font:{ fontFamily:'Arial',fontSize:11,fontWeight:'bold' },
	text:'Once logged in, please click the Close button to continue.'
});
win.add(labelClose);
labelClose.hide();

buttonLogin.addEventListener('click', function()
{

	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function()
	{		
		// Parse ticket response - http://stackoverflow.com/questions/5544023/appcelerator-parse-and-extract-data-from-xml-please-help
		var doc = this.responseXML.documentElement; // Give me a xml document.
  		var status = doc.getElementsByTagName("status").item(0).text;
  		
  		ticket = doc.getElementsByTagName("ticket").item(0).text; // Get the token element, then the first item (could be lots of them) then the text of the first.
		Ti.App.Properties.setString('ticket', ticket);
				
		// Redirect via Webview to Box.Net login
		webview.url = 'https://m.box.net/api/1.0/auth/' + ticket;
		win.add(webview);
		closeModalButton.show();
		labelClose.show();
		
		//win.open({modal:true});
		
	};
	
	// open the client and encode our URL
	xhr.open('GET','https://www.box.net/api/1.0/rest?action=get_ticket&api_key=[INSERTAPIKEY]');

	// send the data
	xhr.send();
	
});


closeModalButton.addEventListener('click', function()
{
	// Go back to Box.net and call get_auth_ticket
	var xhr = Titanium.Network.createHTTPClient();
	
	xhr.onload = function()
	{		
		
		if(this.responseXML.documentElement != null)
		{
			// Parse ticket response - http://stackoverflow.com/questions/5544023/appcelerator-parse-and-extract-data-from-xml-please-help
			var doc = this.responseXML.documentElement; // Give me a xml document.
	  		var status = doc.getElementsByTagName("status").item(0).text;
			
			if(status == 'get_auth_token_ok')
			{
				labelClose.hide();
				webview.hide();
				closeModalButton.hide();

				var auth_token = doc.getElementsByTagName("auth_token").item(0).text;
				var user = doc.getElementsByTagName("user").item(0).text;
				var user_login = doc.getElementsByTagName("login").item(0).text;
				var user_email = doc.getElementsByTagName("email").item(0).text;
				var user_access_id = doc.getElementsByTagName("access_id").item(0).text;
				var user_user_id = doc.getElementsByTagName("user_id").item(0).text;
				var user_space_amount = doc.getElementsByTagName("space_amount").item(0).text;
				var user_space_used = doc.getElementsByTagName("space_used").item(0).text;
				var user_max_upload_size = doc.getElementsByTagName("max_upload_size").item(0).text;
			
				// Store User Logged In Credentials
				Ti.App.Properties.setString('auth_token', auth_token);
				Ti.App.Properties.setString('user_login', user_login);
				Ti.App.Properties.setString('user_email', user_email);
				Ti.App.Properties.setString('user_access_id', user_access_id);
				Ti.App.Properties.setString('user_user_id', user_user_id);
				Ti.App.Properties.setString('user_space_amount', user_space_amount);
				Ti.App.Properties.setString('user_space_used', user_space_used);
				Ti.App.Properties.setString('user_max_upload_size', user_max_upload_size);
			
				//tab1.window = 'winShowMyWabs';
				Ti.App.fireEvent('switchTab', { tab: 'showmywabs' });

			}
			else if(status == 'not_logged_in')
			{
				// TODO: User did not authenticate prperly on modal
				//Ti.API.info('status = ' + status);
			}
			else if(status == 'application_restricted')
			{
				// TODO: invalid api_key or application related error
				//Ti.API.info('status = ' + status);
			}
			
		}
		else{
			// TODO: Close button hit too early in process
			//Ti.API.info('The get_auth_token response is NULL.');
		}
	
	};
	
	// open the client and encode our URL
	xhr.open('GET','https://www.box.net/api/1.0/rest?action=get_auth_token&api_key=[INSERTAPIKEY]&ticket=' + ticket);

	// send the data
	xhr.send();	

});
