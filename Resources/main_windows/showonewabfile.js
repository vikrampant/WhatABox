var win = Ti.UI.currentWindow;
//Ti.include('helper.js');

Ti.API.info('*** showonewabfile.js');
Ti.API.info('*** showonewabfile.js - file_id = ' + win.file_id);

// Get file basics - win. file_name, file_id, size, created, updated, description, user_id, smaller_thumbnail, larger_thumbnail, preview_thumbnail

var data = [];

var xhr = Titanium.Network.createHTTPClient();

xhr.onload = function() {
	var doc = this.responseXML;
	var status = doc.getElementsByTagName("status").item(0).text;

	if(status == 'get_comments_ok') {
		var comments = doc.getElementsByTagName("comment");
		if(comments != null) {
			Ti.API.info('# of comments: ' + comments.item.length);

			//for(var i = 0; i < comments.item.length; i++) {
			for (var i = comments.item.length - 1; i >= 0; i--){
				Ti.API.info('comment_id : ' + doc.getElementsByTagName("comment_id").item(i).text);
				Ti.API.info('message : ' + doc.getElementsByTagName("message").item(i).text);
				Ti.API.info('user_id : ' + doc.getElementsByTagName("user_id").item(i).text);
				Ti.API.info('user_name : ' + doc.getElementsByTagName("user_name").item(i).text);
				Ti.API.info('created : ' + doc.getElementsByTagName("created").item(i).text);
				Ti.API.info('avatar_url : ' + doc.getElementsByTagName("avatar_url").item(i).text);

				var dateCreated = new Date();
				dateCreated.setTime(doc.getElementsByTagName("created").item(i).text * 1000);
				Ti.API.info('dateCreated : ' + dateCreated.toString());

				var row = Ti.UI.createTableViewRow();
				row.selectedBackgroundColor = '#fff';
				row.height = 120;
				row.className = 'datarow';
				row.clickName = 'row';

				var photo = Titanium.UI.createImageView({
					image : doc.getElementsByTagName("avatar_url").item(i).text,
					top : 5,
					left : 10,
					height : 40,
					width : 40,
					clickName : 'avatar'
				});
				row.add(photo);

				var user = Ti.UI.createLabel({
					color : '#576996',
					font : {
						fontSize : 16,
						fontWeight : 'bold',
						fontFamily : 'Arial'
					},
					left : 70,
					top : 2,
					height : 'auto',
					width : 200,
					clickName : 'user',
					text : doc.getElementsByTagName("user_name").item(i).text
				});
				row.add(user);

				var comment = Ti.UI.createLabel({
					color : '#222',
					font : {
						fontSize : 14,
						fontWeight : 'normal',
						fontFamily : 'Arial'
					},
					left : 70,
					top : 21,
					height : 'auto',
					width : 200,
					clickName : 'comment',
					text : doc.getElementsByTagName("message").item(i).text
				});
				row.add(comment);

				var calendar = Ti.UI.createView({
					backgroundImage : '../images/custom_tableview/eventsButton.png',
					bottom : 12,
					left : 10,
					width : 32,
					clickName : 'calendar',
					height : 32
				});
				row.add(calendar);

				var button = Ti.UI.createView({
					backgroundImage : '../images/custom_tableview/commentButton.png',
					top : 35,
					right : 5,
					width : 36,
					clickName : 'button',
					height : 34
				});
				//row.add(button);

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
					text : 'posted on ' + dateCreated.toString()
					//text: 'posted on ' //+  date('F j, Y', doc.getElementsByTagName("created").item(i).text)
				});
				row.add(date);

				data.push(row);

			}

			var tableView = Titanium.UI.createTableView({
				top : 70,
				height : 230,
				data : data,
				backgroundColor : 'white',
				borderColor : 'black',
				borderWidth : 0
			});
			tableView.addEventListener('click', function(e) {
				Ti.API.info('table view row clicked - source ' + e.source);
			});
			win.add(tableView);

		} else {
			Ti.API.info('!!! No comments');
		}
	} else if(status == 'application_restricted') {
		// TODO: You provided an invalid api_key, or the api_key is restricted from calling this function
	} else if(status == 'not_logged_in') {
		// TODO: The user did not successfully authenticate on the page provided in the authentication process.
		Ti.App.info('!!! User Not Logged In !!!');
	} else if(status == 'get_comments_error') {
		// TODO: Another error occured in your call.  You may want to verify that you provided a valid item type and id
	}
}
//https://www.box.net/api/1.0/rest?action=get_comments&api_key=z9jbj98ttynrc3hj1x203cmibjaoy4ae&auth_token=' + Ti.App.Properties.getString('auth_token')&target=file&target_id=' + win.file_id
Ti.API.info('https://www.box.net/api/1.0/rest?action=get_comments&api_key=[INSERTAPIKEY]&auth_token=' + Ti.App.Properties.getString('auth_token') + '&target=file&target_id=' + win.file_id);
xhr.open('GET', 'https://www.box.net/api/1.0/rest?action=get_comments&api_key=[INSERTAPIKEY]&auth_token=' + Ti.App.Properties.getString('auth_token') + '&target=file&target_id=' + win.file_id);

xhr.send();

var imageviewIcon = Titanium.UI.createImageView({
	image : win.file_thumbnail,
	top : 10,
	left : 10,
	height : 27,
	width : 30
});
imageviewIcon.addEventListener('click', function(e) {
	downloadLink();
});
win.add(imageviewIcon);

var labelDownloadFile = Ti.UI.createLabel({
	top : 15,
	left : 50,
	height : 'auto',
	width : 'auto',
	text : 'Download File',
	font : {
		fontSize : 16,
		fontWeight : 'bold',
		fontFamily : 'Arial'
	}
});
labelDownloadFile.addEventListener('click', function(e) {
	downloadLink();
});
win.add(labelDownloadFile);

function downloadLink() {
	// TODO: https://www.box.net/api/1.0/download/<auth_token>/<file_id> for download link
	Ti.API.info('downloadLink');	
	Ti.App.fireEvent('openShowFile',{
		file_download_url:'https://www.box.net/api/1.0/download/' + Ti.App.Properties.getString('auth_token') + '/' + win.file_id
	});
}

var labelComments = Ti.UI.createLabel({
	top : 45,
	left : 10,
	height : 'auto',
	width : 'auto',
	text : 'Comments',
	font : {
		fontSize : 16,
		fontWeight : 'bold',
		fontFamily : 'Arial'
	}
});
win.add(labelComments);

var buttonAddComment = Ti.UI.createButton({
	title : 'Add Comment',
	height : 40,
	width : 300,
	bottom : 10,
	file_id : win.file_id,
	file_name : win.file_name
});
buttonAddComment.addEventListener('click', function(e) {
	Ti.API.info('clicked button to add comment');
	Ti.App.fireEvent('openAddComments',{
		target_id: win.file_id
	});	
});
win.add(buttonAddComment);
