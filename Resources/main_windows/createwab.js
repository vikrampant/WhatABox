var win = Ti.UI.currentWindow;

Ti.API.info('*** createwab.js');

var scrolly = Titanium.UI.createScrollView({
	contentHeight : 'auto',
	top : 5
});
win.add(scrolly);

// Title textbox
var titleTextField = Titanium.UI.createTextField({
	color : '#336699',
	top : 20,
	height : 35,
	left : 20,
	width : 280,
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	suppressReturn: true
});
scrolly.add(titleTextField);

// Slider for Public shared, yes or no
// (default is private)
var publicSwitch = Titanium.UI.createSwitch({
	top : 60,
	value : false
});
scrolly.add(publicSwitch);

var button = Titanium.UI.createButton({
	title : 'Create WaB',
	top : 100,
	width : 200,
	height : 40
});
scrolly.add(button);

button.addEventListener('click', function() {

	var folderName = titleTextField.value;
	var isPublic = publicSwitch.value;
	var shareValue = 0;
	if(isPublic == true) {
		shareValue = 1;
	} else {
		shareValue = 0;
	}

	var xhr = Titanium.Network.createHTTPClient();
	xhr.autoEncodeUrl = true;
	xhr.onload = function() {
		if(this.responseXML.documentElement != null) {
			var doc = this.responseXML.documentElement;
			// Give me a xml document.
			var status = doc.getElementsByTagName("status").item(0).text;
			if(status == 'create_ok') {
				// Display modal popup with results and recap and if shared == 1, show invite collaborators button
				var newFolderId = doc.getElementsByTagName("folder_id").item(0).text;
				var newFolderName = doc.getElementsByTagName("folder_name").item(0).text;
				Ti.API.info(newFolderId + ' ' + newFolderName);

				Ti.App.fireEvent('openCreatedWab',{
					folder_id:newFolderId,
					folder_name:newFolderName,
					is_shared:shareValue
					});
					
				titleTextField.value = '';
				publicSwitch.value = false;
					

			} else if(status == 'no_parent') {
				// The folder_id provided is not a valid folder_id for the user's account.
			} else if(status == 's_folder_exists') {
				// A folder withthe same name already exists in that location.
				Ti.API.info('A folder withthe same name already exists in that location.');
			} else if(status == 'not_logged_in') {
				// The user is not logged into your application.  Your authentication_token is not valid.
			} else if(status == 'application_restricted') {
				// You provided an invalid api_key, or the api_key is restricted from calling this function.
			} else if(status == 'invalid_folder_name') {
				// The name provided for the new folder contained invalid characters or too many characters.
			} else if(status == 'e_no_access') {
				// he user does not have the necessary permissions to perform the specified operation.  Most likely the user is trying to create a folder within a collaborated folder, for which the user has view-only permission.
			} else if(status == 'e_no_folder_name') {
				// A folder name was not properly provided.
			} else if(status == 'folder_name_too_big') {
				// The folder name contained more than 100 characters, exceeding the folder name length limit.
			} else if(status == 'e_input_params') {
				// Another invalid input was provided (example: an invalid value for the 'share' parameter).
			}
		}

	};
	// open the client and encode our URL
	xhr.open('GET', 'https://www.box.net/api/1.0/rest?action=create_folder&api_key=[INSERTAPIKEY]&auth_token=' + Ti.App.Properties.getString('auth_token') + '&parent_id=0&name=WaB_' + folderName + '&share=' + shareValue);

	// send the data
	xhr.send();
});
