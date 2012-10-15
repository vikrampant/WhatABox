var win = Ti.UI.currentWindow;

Ti.API.info('*** showfile.js');
Ti.API.info('*** showfile.js - url = ' + win.file_download_url);

// TODO: Open a new window with 100% WebView for file viewing

var ind = Titanium.UI.createProgressBar({
	width : 200,
	height : 50,
	min : 0,
	max : 1,
	value : 0,
	style : Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
	top : 10,
	message : 'Downloading File',
	font : {
		fontSize : 12,
		fontWeight : 'bold'
	},
	color : '#888'
});

win.add(ind);
ind.show();

ind.value = 0;
c = Titanium.Network.createHTTPClient();
c.setTimeout(10000);
c.onload = function() {
	Ti.API.info('IN ONLOAD ');

	var filename = Titanium.Platform.name == 'android' ? 'test.png' : 'test.pdf';
	var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
	if(Titanium.Platform.name == 'android') {
		f.write(this.responseData);
	}

	var wv = Ti.UI.createWebView({
		url : f.nativePath,
		bottom : 0,
		left : 0,
		right : 0,
		top : 0
	});
	win.add(wv);
};
c.ondatastream = function(e) {
	ind.value = e.progress;
	Ti.API.info('ONDATASTREAM1 - PROGRESS: ' + e.progress);
};
c.onerror = function(e) {
	Ti.API.info('XHR Error ' + e.error);
};
// open the client
if(Titanium.Platform.name == 'android') {
	//android's WebView doesn't support embedded PDF content
	c.open('GET', 'http://www.appcelerator.com/wp-content/uploads/2009/06/titanium_desk.png');
} else {
	c.open('GET', 'http://www.appcelerator.com/assets/The_iPad_App_Wave.pdf');
	//c.open('GET', win.file_download_url);
	c.file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'test.pdf');
}

// send the data
c.send();
