var win = Ti.UI.currentWindow;
//Ti.include('helper.js');

Ti.API.info('*** add_comments.js');
Ti.API.info('*** add_comments.js - target_id = ' + win.target_id);

var textAreaComment = Titanium.UI.createTextArea({
	editable : true,
	value : 'I am a textarea',
	height : 260,
	width : 300,
	top : 40,
	font : {
		fontSize : 16,
		fontFamily : 'Arial',
		fontWeight : 'normal'
	},
	color : '#888',
	textAlign : 'left',
	borderWidth : 2,
	borderColor : '#bbb',
	borderRadius : 5,
	suppressReturn : true
});
win.add(textAreaComment);

var buttonCreateComment = Ti.UI.createButton({
	title : 'Create Comment',
	bottom : 10,
	width : 300,
	height : 40
});

buttonCreateComment.addEventListener('click', function(e) {
	var xhr = Titanium.Network.createHTTPClient();

	xhr.onload = function() {

		if(this.responseXML.documentElement != null) {
			// Parse ticket response - http://stackoverflow.com/questions/5544023/appcelerator-parse-and-extract-data-from-xml-please-help
			var doc = this.responseXML;
			var status = doc.getElementsByTagName("status").item(0).text;

			if(status == 'add_comment_ok') {
				// TODO: Successful comment post
				win.close();
			} else if(status == 'application_restricted') {
				// TODO: You provided an invalid api_key, or the api_key is restricted from calling this function
			} else if(status == 'not_logged_in') {
				// TODO: The user did not successfully authenticate on the page provided in the authentication process.
				Ti.App.info('!!! User Not Logged In !!!');
			} else if(status == 'add_comment_error') {
				// TODO: Another error occured in your call.  You may want to verify that you are using a valid folder_id, and valid params[] input.
			}

		} else {
			// TODO: Why is XML response NULL?
			Ti.API.info('xml result = null');
		}

	}
	// https://www.box.net/api/1.0/rest?action=add_comment&api_key=rrc1d3n4b53tt6b2vh1il6tdtrsxov3v&auth_token=ekp2t8vb8l1spb1mnonlqmgztkrq1rtl&target=file&target_id=3522216&message=test
	Ti.API.info('https://www.box.net/api/1.0/rest?action=add_comment&api_key=[INSERTAPIKEY]&auth_token=' + Ti.App.Properties.getString('auth_token') + '&target=file&target_id=' + win.target_id + '&message=' + textAreaComment.value);
	xhr.open('GET', 'https://www.box.net/api/1.0/rest?action=add_comment&api_key=[INSERTAPIKEY]&auth_token=' + Ti.App.Properties.getString('auth_token') + '&target=file&target_id=' + win.target_id + '&message=' + textAreaComment.value);

	xhr.send();

});

win.add(buttonCreateComment);
