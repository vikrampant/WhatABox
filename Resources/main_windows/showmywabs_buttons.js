var win = Ti.UI.currentWindow;

Ti.API.info('*** showmywabs.js');
Ti.API.info('auth_token = ' + Ti.App.Properties.getString('auth_token'));

function loadWabs(){

	var xhr = Titanium.Network.createHTTPClient();

	xhr.onload = function(){
		
		if(this.responseXML.documentElement != null)
		{
			// Parse ticket response - http://stackoverflow.com/questions/5544023/appcelerator-parse-and-extract-data-from-xml-please-help
			var doc = this.responseXML;
	  		var status = doc.getElementsByTagName("status").item(0).text;
			
			if(status == 'listing_ok')
			{					

				var folders = doc.getElementsByTagName("folder");
				Ti.API.info('length of folder = ' + folders.item.length);

				var buttons = new Array();
				var j = 0;

				for(var i=0; i < folders.item.length; i++)
				{
					if(folders.item(i).getAttribute("id") != 0)
					{
						Ti.API.log('Param ' + i + ': id: ' + folders.item(i).getAttribute("id"));
						Ti.API.log('Param ' + i + ': name: ' + folders.item(i).getAttribute("name"));
						
						var subStr = folders.item(i).getAttribute("name").substring(3, 0);
						Ti.API.info(subStr);
					
						if(subStr == 'WaB') {
							Ti.API.log('Param ' + i + ': id: ' + folders.item(i).getAttribute("id"));
							Ti.API.log('Param ' + i + ': name: ' + folders.item(i).getAttribute("name"));
					
							buttons[j] = Ti.UI.createButton({
								title : folders.item(i).getAttribute("name").replace('WaB_', ''),
								height : 40,
								width : 300,
								top : 10 + (j * 50),
								folder_id : folders.item(i).getAttribute("id"),
								folder_title: folders.item(i).getAttribute("name").replace('WaB_', '')
							});
					
							buttons[j].addEventListener('click', function(e) {
								Ti.API.info('e.source.folder_id is ' + e.source.folder_id);
								Ti.App.fireEvent('openShowOneWab', {
									folder_title:e.source.folder_title,
									folder_id:e.source.folder_id
								});
							});
							j++;
						}						
					}
				}
							
				win.add(buttons);
			}
			else if(status == 'application_restricted')
			{
				// TODO: You provided an invalid api_key, or the api_key is restricted from calling this function	
			}
			else if(status == 'not_logged_in')
			{
				// TODO: The user did not successfully authenticate on the page provided in the authentication process.
				Ti.App.info('!!! User Not Logged In !!!');
			}
			else if(status == 'e_folder_id')
			{
				// TODO: Another error occured in your call.  You may want to verify that you are using a valid folder_id, and valid params[] input.
			}

		}
		else{
			// TODO: Why is XML response NULL?
			Ti.API.info('xml result = null');
		}
			
	}	

	Ti.API.info('https://www.box.net/api/1.0/rest?action=get_account_tree&api_key=[INSERTAPIKEY]&auth_token=' + Ti.App.Properties.getString('auth_token') + '&folder_id=0&params[]=nozip&params[]=onelevel');
	xhr.open('GET','https://www.box.net/api/1.0/rest?action=get_account_tree&api_key=[INSERTAPIKEY]&auth_token=' + Ti.App.Properties.getString('auth_token') + '&folder_id=0&params[]=nozip&params[]=onelevel');
	
	xhr.send();	
	
}

loadWabs();
