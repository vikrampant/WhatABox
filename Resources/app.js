// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');



// create tab group
var tabGroup = Titanium.UI.createTabGroup({
	//backgroundImage : 'images/bg.png'
});

var winShowMyWabs = Titanium.UI.createWindow({  
    url:'main_windows/showmywabs.js',
    title:'Show My WaBs',
    backgroundColor:'#ffffff',
    backgroundImage : 'images/bg.png'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Show My WaBs',
    window:winShowMyWabs
});


var winCreateWab = Titanium.UI.createWindow({  
	url:'main_windows/createwab.js',
    title:'Create WaB',
    backgroundColor:'#ffffff',
    backgroundImage : 'images/bg.png'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Create WaB',
    window:winCreateWab
});


var winSettings = Titanium.UI.createWindow({  
	url:'main_windows/settings.js',
    title:'Settings & Login',
    backgroundColor:'#ffffff',
    backgroundImage : 'images/bg.png'
});
var tab3 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Settings',
    window:winSettings
});

// -----------------

var winShowOneWab = Ti.UI.createWindow({
	url:'main_windows/showonewab.js',
    backgroundColor:'#ffffff',
    //backgroundImage : 'images/bg.png'
});

var winShowOneWabFile = Ti.UI.createWindow({
	url:'main_windows/showonewabfile.js',
    backgroundColor:'#ffffff',
    //backgroundImage : 'images/bg.png'
});

var winShowFile = Ti.UI.createWindow({
	url:'main_windows/showfile.js',
	backgroundColor:'#ffffff',
	//backgroundImage : 'images/bg.png'
});

var winAddComments = Ti.UI.createWindow({
	url:'main_windows/add_comments.js',
	backgroundColor:'#ffffff',
	//backgroundImage : 'images/bg.png'
});

var winCreatedWab = Ti.UI.createWindow({
	url:'main_windows/createdwab.js',
	backgroundColor:'#ffffff',
	backgroundImage : 'images/bg.png'
});

var winContactsPicker = Ti.UI.createWindow({
	url: 'main_windows/contacts_picker.js',
	backgroundColor:'#ffffff'
});

var winContactsSingle = Ti.UI.createWindow({
	url: 'main_windows/contacts_single.js',
	backgroundColor:'#ffffff',
	backgroundImage : 'images/bg.png'
});

// -----------------

Ti.App.addEventListener('switchTab', function(e) {
	switch (e.tab) {
		case 'showmywabs':
			//tab1.open(winShowMyWabs, {animated:true});
			tabGroup.setActiveTab(tab1);
			break
		case 'createwab':
			tabGroup.setActiveTab(tab2);
			break;
		case 'settings':
			tabGroup.setActiveTab(tab3);
			break;
	}
});

Ti.App.addEventListener('openShowOneWab', function(e)
{
	winShowOneWab.folder_id = e.folder_id;
	winShowOneWab.title = e.folder_title;
	tab1.open(winShowOneWab, {animated:true});
});

//file_name, file_id, size, created, updated, description, user_id, smaller_thumbnail, larger_thumbnail, preview_thumbnail
Ti.App.addEventListener('openShowOneWabFile', function(e)
{
	winShowOneWabFile.file_name = e.file_name;
	winShowOneWabFile.file_id = e.file_id;
	winShowOneWabFile.file_size = e.file_size;
	winShowOneWabFile.file_created = e.file_created;
	winShowOneWabFile.file_updated = e.file_updated;
	winShowOneWabFile.file_description = e.file_description;
	winShowOneWabFile.file_user_id = e.file_user_id;
	winShowOneWabFile.file_thumbnail = e.file_thumbnail;
	winShowOneWabFile.file_large_thumbnail = e.file_large_thumbnail;
	winShowOneWabFile.file_preview_thumbnail = e.file_preview_thumbnail;
	winShowOneWabFile.title = e.file_name;
	tab1.open(winShowOneWabFile, {animated:true});
});

Ti.App.addEventListener('openShowFile', function(e){
	winShowFile.file_download_url = e.file_download_url;
	tab1.open(winShowFile, {animated:true});
});

Ti.App.addEventListener('openAddComments', function(e){
	winAddComments.title = 'Add Comment';
	winAddComments.target_id = e.target_id;
	tab1.open(winAddComments, {animated:true});
});

Ti.App.addEventListener('openCreatedWab', function(e){
	winCreatedWab.folder_id = e.folder_id;
	winCreatedWab.folder_name = e.folder_name;
	winCreatedWab.is_shared = e.is_shared;
	tab2.open(winCreatedWab, {animated:true});
});

Ti.App.addEventListener('openContactsPicker', function(e){
	winContactsPicker.folder_id = e.folder_id;
	winContactsPicker.title = 'Select From Contacts';
	tab2.open(winContactsPicker, {animated:true});
});

Ti.App.addEventListener('openContactsSingle', function(e){
	winContactsSingle.title = 'Contact - ' + e.fullname;
	winContactsSingle.folder_id = e.folder_id;
	winContactsSingle.fullname = e.fullname;
	winContactsSingle.arrayOfEmails = e.arrayOfEmails;
	winContactsSingle.image = e.image;
	tab2.open(winContactsSingle, {animated:true});
});

Ti.App.addEventListener('openMyWabsPostShare', function(e){
	//winShowMyWabs.data = [];
	tabGroup.setActiveTab(tab1);
	//tab1.open(winShowMyWabs, {animated:true});
});

// -----------------

//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  
tabGroup.addTab(tab3);

// open tab group
tabGroup.open();

// Determine where to go (ShowMyWaB or Settings)
var auth_token = Ti.App.Properties.getString('auth_token');
if(auth_token == null)
{
	Ti.App.fireEvent('switchTab', { tab: 'settings' });
	Ti.API.info('user is not logged in');
}
else
{
	Ti.App.fireEvent('switchTab', { tab: 'settings' });
	//Ti.App.fireEvent('switchTab', { tab: 'showmywabs' });
	//Ti.API.info('user is logged in, auth_token = ' + auth_token);
}
