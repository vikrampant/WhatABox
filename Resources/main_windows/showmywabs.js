var win = Ti.UI.currentWindow;

Ti.API.info('*** showmywabs.js');
Ti.API.info('auth_token = ' + Ti.App.Properties.getString('auth_token'));

var data = [];

//button refresh
var buttonRefresh = Titanium.UI.createButton({
	systemButton : Titanium.UI.iPhone.SystemButton.REFRESH,
});
win.setRightNavButton(buttonRefresh);
buttonRefresh.addEventListener('click', function() {
	data = [];
	loadWabs();
});

function loadWabs() {

	var xhr = Titanium.Network.createHTTPClient();

	xhr.onload = function() {

		if(this.responseXML.documentElement != null) {
			// Parse ticket response - http://stackoverflow.com/questions/5544023/appcelerator-parse-and-extract-data-from-xml-please-help
			var doc = this.responseXML;
			var status = doc.getElementsByTagName("status").item(0).text;

			if(status == 'listing_ok') {

				var folders = doc.getElementsByTagName("folder");
				Ti.API.info('length of folder = ' + folders.item.length);

				//for(var i = 0; i < folders.item.length; i++) {
				for(var i = folders.item.length - 1; i >= 0; i--) {
					if(folders.item(i).getAttribute("id") != 0) {
						Ti.API.log('Param ' + i + ': id: ' + folders.item(i).getAttribute("id"));
						Ti.API.log('Param ' + i + ': name: ' + folders.item(i).getAttribute("name"));

						var subStr = folders.item(i).getAttribute("name").substring(3, 0);
						Ti.API.info(subStr);

						if(subStr == 'WaB') {
							Ti.API.log('Param ' + i + ': id: ' + folders.item(i).getAttribute("id"));
							Ti.API.log('Param ' + i + ': name: ' + folders.item(i).getAttribute("name"));
							Ti.API.log('Param ' + i + ': description: ' + folders.item(i).getAttribute("description"));
							Ti.API.log('Param ' + i + ': user_id: ' + folders.item(i).getAttribute("user_id"));
							Ti.API.log('Param ' + i + ': name: ' + folders.item(i).getAttribute("name"));
							Ti.API.log('Param ' + i + ': shared: ' + folders.item(i).getAttribute("shared"));
							Ti.API.log('Param ' + i + ': shared_link: ' + folders.item(i).getAttribute("shared_link"));
							Ti.API.log('Param ' + i + ': size: ' + folders.item(i).getAttribute("size"));
							Ti.API.log('Param ' + i + ': file_count: ' + folders.item(i).getAttribute("file_count"));
							Ti.API.log('Param ' + i + ': created: ' + folders.item(i).getAttribute("created"));
							Ti.API.log('Param ' + i + ': updated: ' + folders.item(i).getAttribute("updated"));

							var dateCreated = new Date();
							dateCreated.setTime(folders.item(i).getAttribute("created") * 1000);
							Ti.API.info('dateCreated : ' + dateCreated.toString());

							var dateUpdated = new Date();
							dateUpdated.setTime(folders.item(i).getAttribute("updated") * 1000);
							Ti.API.info('dateUpdated : ' + dateUpdated.toString());

							var row = Ti.UI.createTableViewRow();
							row.selectedBackgroundColor = '#fff';
							row.height = 140;
							row.className = 'datarow';
							row.clickName = 'row';

							var photo = Titanium.UI.createImageView({
								image : '../images/closed.png',
								top : 5,
								left : 10,
								height : 60,
								width : 60,
								clickName : 'avatar',
								folder_id : folders.item(i).getAttribute("id"),
								folder_title : folders.item(i).getAttribute("title")
							});
							row.add(photo);

							var title = Ti.UI.createLabel({
								color : '#576996',
								font : {
									fontSize : 18,
									fontWeight : 'bold',
									fontFamily : 'Arial'
								},
								left : 75,
								top : 5,
								height : 'auto',
								width : 200,
								clickName : 'user',
								text : folders.item(i).getAttribute("name").replace('WaB_', ''),
								folder_id : folders.item(i).getAttribute("id"),
								folder_title : folders.item(i).getAttribute("title")
							});
							row.add(title);

							var description = Ti.UI.createLabel({
								color : '#222',
								font : {
									fontSize : 13,
									fontWeight : 'normal',
									fontFamily : 'Arial'
								},
								left : 75,
								top : 30,
								height : 'auto',
								width : 'auto',
								clickName : 'comment',
								text : folders.item(i).getAttribute("description"),
								folder_id : folders.item(i).getAttribute("id"),
								folder_title : folders.item(i).getAttribute("title")
							});
							row.add(description);

							var fileCount = Ti.UI.createLabel({
								color : '#25383C',
								font : {
									fontSize : 32,
									fontWeight : 'bold',
									fontFamily : 'Arial'
								},
								left : 12,
								top : 40,
								height : 'auto',
								width : 40,
								textAlign : 'left',
								clickName : 'comment',
								text : folders.item(i).getAttribute("file_count"),
								folder_id : folders.item(i).getAttribute("id"),
								folder_title : folders.item(i).getAttribute("title")
							});
							row.add(fileCount);

							var calendar = Ti.UI.createView({
								backgroundImage : '../images/custom_tableview/eventsButton.png',
								bottom : 12,
								left : 10,
								width : 32,
								clickName : 'calendar',
								height : 32,
								folder_id : folders.item(i).getAttribute("id"),
								folder_title : folders.item(i).getAttribute("title")
							});
							row.add(calendar);

							var date = Ti.UI.createLabel({
								color : '#999',
								font : {
									fontSize : 13,
									fontWeight : 'normal',
									fontFamily : 'Arial'
								},
								left : 42,
								bottom : 15,
								height : 20,
								width : 'auto',
								clickName : 'date',
								text : 'created on ' + dateCreated.toString(),
								folder_id : folders.item(i).getAttribute("id"),
								folder_title : folders.item(i).getAttribute("title")
							});
							row.add(date);

							row.addEventListener('click', function(e) {
								Ti.API.info('e.source.folder_id is ' + e.source.folder_id);
								Ti.App.fireEvent('openShowOneWab', {
									folder_title : e.source.folder_title,
									folder_id : e.source.folder_id
								});
							});

							data.push(row);

						}
					}
				}

				var tableView = Titanium.UI.createTableView({
					top : 0,
					height : 360,
					data : data,
					backgroundColor : 'white',
					borderColor : 'black',
					borderWidth : 0
				});
				tableView.addEventListener('click', function(e) {
					Ti.API.info('table view row clicked - source ' + e.source);
				});
				win.add(tableView);

			} else if(status == 'application_restricted') {
				// TODO: You provided an invalid api_key, or the api_key is restricted from calling this function
			} else if(status == 'not_logged_in') {
				// TODO: The user did not successfully authenticate on the page provided in the authentication process.
				Ti.App.info('!!! User Not Logged In !!!');
			} else if(status == 'e_folder_id') {
				// TODO: Another error occured in your call.  You may want to verify that you are using a valid folder_id, and valid params[] input.
			}

		} else {
			// TODO: Why is XML response NULL?
			Ti.API.info('xml result = null');
		}

	}

	Ti.API.info('https://www.box.net/api/1.0/rest?action=get_account_tree&api_key=[INSERTAPIKEY]&auth_token=' + Ti.App.Properties.getString('auth_token') + '&folder_id=0&params[]=nozip&params[]=onelevel');

	xhr.open('GET', 'https://www.box.net/api/1.0/rest?action=get_account_tree&api_key=[INSERTAPIKEY]&auth_token=' + Ti.App.Properties.getString('auth_token') + '&folder_id=0&params[]=nozip&params[]=onelevel');

	xhr.send();

}

loadWabs();