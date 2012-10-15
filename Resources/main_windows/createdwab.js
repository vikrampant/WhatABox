var win = Ti.UI.currentWindow;

Ti.API.info('*** createdwab.js');
Ti.API.info('*** createdwab.js - folder_id = ' + win.folder_id);
Ti.API.info('*** createdwab.js - is_shared = ' + win.is_shared);

// Display modal with success results
var labelFolderName = Titanium.UI.createLabel({
	top:40,
	width:300,
	height:100,
	id:'label_folder_name',
	text:'Your folder, ' + win.folder_name.replace('WaB_','') + ', (' + win.folder_id + ') has been created.',
	color:'#ffffff'
});
win.add(labelFolderName);

// If Shared == 1, then show add email area
var showMyContacts = Ti.UI.createButton({
	title:'Share With My Contacts',
	top:180,
	width:200,
	height:40
});

showMyContacts.addEventListener('click', function() {
	Ti.App.fireEvent('openContactsPicker',{
		folder_id:win.folder_id
	});
});

if(win.is_shared == 1){
	Ti.API.info('is_shared == 1');
	win.add(showMyContacts);	
}