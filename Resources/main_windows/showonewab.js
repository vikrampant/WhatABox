var win = Ti.UI.currentWindow;

Ti.API.info('*** showonewab.js');
Ti.API.info('*** showonewab.js - folder_id = ' + win.folder_id);

var arrayOfViews = new Array();

var xhr = Titanium.Network.createHTTPClient();

xhr.onload = function() {
	if(this.responseXML.documentElement != null) {
		// Parse ticket response - http://stackoverflow.com/questions/5544023/appcelerator-parse-and-extract-data-from-xml-please-help
		var doc = this.responseXML;
		var status = doc.getElementsByTagName("status").item(0).text;

		if(status == 'listing_ok') {
			var files = doc.getElementsByTagName("file");
			Ti.API.info('***' + doc.getElementsByTagName("folder").item(0).getAttribute("file_count"));

			if(doc.getElementsByTagName("folder").item(0).getAttribute("file_count") != 0) {
				Ti.API.info('length of files = ' + files.item.length);

				for(var i = 0; i < files.item.length; i++) {
					var dateCreated = new Date();
					dateCreated.setTime(files.item(i).getAttribute("created") * 1000);
					Ti.API.info('dateCreated : ' + dateCreated.toString());

					arrayOfViews[i] = Ti.UI.createView({
						backgroundColor : '#c0c0c0',
						file_name : files.item(i).getAttribute("file_name"),
						file_id : files.item(i).getAttribute("id")
					});

					arrayOfViews[i].add(Titanium.UI.createImageView({
						image : files.item(i).getAttribute("preview_thumbnail"),
						top : 20,
						height : 152,
						width : 180,
						file_name : files.item(i).getAttribute("file_name"),
						file_id : files.item(i).getAttribute("id"),
						file_size : files.item(i).getAttribute("size"),
						file_created : files.item(i).getAttribute("created"),
						file_updated : files.item(i).getAttribute("updated"),
						file_description : files.item(i).getAttribute("description"),
						file_user_id : files.item(i).getAttribute("user_id"),
						file_thumbnail : files.item(i).getAttribute("thumbnail"),
						file_large_thumbnail : files.item(i).getAttribute("large_thumbnail"),
						file_preview_thumbnail : files.item(i).getAttribute("preview_thumbnail")
					}));

					arrayOfViews[i].add(Ti.UI.createLabel({
						top : 180,
						text : files.item(i).getAttribute("file_name"),
						font : {
							fontFamily : 'Arial',
							fontSize : 14,
							fontWeight : 'bold'
						},
						color : '#fff',
						width : 'auto',
						height : 'auto',
						file_name : files.item(i).getAttribute("file_name"),
						file_id : files.item(i).getAttribute("id")
					}));

					arrayOfViews[i].add(Titanium.UI.createLabel({
						top : 200,
						text : dateCreated.toString(),
						font : {
							fontFamily : 'Arial',
							fontSize : 12
						},
						color : '#fff',
						width : 'auto',
						height : 'auto',
						file_name : files.item(i).getAttribute("file_name"),
						file_id : files.item(i).getAttribute("id")
					}));

					arrayOfViews[i].add(Titanium.UI.createLabel({
						top : 240,
						text : files.item(i).getAttribute("description"),
						font : {
							fontFamily : 'Arial',
							fontSize : 12
						},
						color : '#fff',
						width : 'auto',
						height : 'auto',
						file_name : files.item(i).getAttribute("file_name"),
						file_id : files.item(i).getAttribute("id")
					}));

				}

				// add view to win
				var scrollView = Titanium.UI.createScrollableView({
					views : arrayOfViews,
					showPagingControl : true,
					pagingControlHeight : 30,
					maxZoomScale : 2.0,
					currentPage : 1
				});

				win.add(scrollView);

				var i = 1;
				var activeView = arrayOfViews[0];

				scrollView.addEventListener('scroll', function(e) {
					activeView = e.view;
					// the object handle to the view that is about to become visible
					i = e.currentPage;
					Titanium.API.info("scroll called - current index " + i + ' active view ' + activeView);
				});
				scrollView.addEventListener('click', function(e) {
					Ti.API.info('ScrollView received click event, source = ' + e.source);
					Ti.API.info('file id = ' + e.source.file_id);
					// TODO: Fire Event to showonewabfile.js with file_name and file_id
					if(e.source == '[object TiUIImageView]') {
						Ti.App.fireEvent('openShowOneWabFile', {
							file_name : e.source.file_name,
							file_id : e.source.file_id,
							file_size : e.source.file_size,
							file_created : e.source.file_created,
							file_updated : e.source.file_updated,
							file_description : e.source.file_description,
							file_user_id : e.source.file_user_id,
							file_thumbnail : e.source.file_thumbnail,
							file_large_thumbnail : e.source.file_large_thumbnail,
							file_preview_thumbnail : e.source.file_preview_thumbnail
						});
					}
				});
				scrollView.addEventListener('touchend', function(e) {
					Ti.API.info('ScrollView received touchend event, source = ' + e.source);
				});
			} else {
				arrayOfViews = [];
				Ti.API.info('!!! No files in this WaB');
			}
		} else if(status == 'application_restricted') {
			// TODO: You provided an invalid api_key, or the api_key is restricted from calling this function
		} else if(status == 'not_logged_in') {
			// TODO: The user did not successfully authenticate on the page provided in the authentication process.
		} else if(status == 'e_folder_id') {
			// TODO: Another error occured in your call.  You may want to verify that you are using a valid folder_id, and valid params[] input.
		}
	} else {
		// TODO: Why is XML response NULL?
		Ti.API.info('xml result = null');
	}
};
// open the client and encode our URL
xhr.open('GET', 'https://www.box.net/api/1.0/rest?action=get_account_tree&api_key=[INSERTAPIKEY]&auth_token=' + Ti.App.Properties.getString('auth_token') + '&folder_id=' + win.folder_id + '&params[]=nozip');
Ti.API.info('https://www.box.net/api/1.0/rest?action=get_account_tree&api_key=[INSERTAPIKEY]&auth_token=' + Ti.App.Properties.getString('auth_token') + '&folder_id=' + win.folder_id + '&params[]=nozip')

// send the data
xhr.send();
