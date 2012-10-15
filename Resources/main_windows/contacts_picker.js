var win = Ti.UI.currentWindow;

Ti.API.info('*** contacts_picker.js');
Ti.API.info('*** contacts_picker.js - folder_id = ' + win.folder_id);

var makeTable = function() {
	var people = Titanium.Contacts.getAllPeople();
	
	var rows = [];
	
	for (var i = 0; i < people.length; i++) {
		Ti.API.info("People object is: "+people[i]);
		var title = people[i].fullName;
		if (!title || title.length === 0) {
			title = "(no name)";
		}
		rows[i] = Ti.UI.createTableViewRow({
			title: title,
			person:people[i],
			hasChild:true
		});
		
		var arrayOfEmails = [];
		var j = 0;
		
		rows[i].addEventListener('click', function(e) {
			for (var label in e.row.person.email) {
				// Build array of email addresses
				Ti.API.info('('+label+') = '+e.row.person.email[label]);
				arrayOfEmails[j] = label + '|' + e.row.person.email[label];
				j++;				
			}
			
			// Open contactsingle and pass in fullname, image and arrayofEmails
			Ti.App.fireEvent('openContactsSingle',{
				folder_id:win.folder_id,
				fullname:e.row.person.fullName,
				arrayOfEmails:arrayOfEmails,
				image:e.row.person.image
			})
		});
	}
	
	return rows;
};

var tableview = Ti.UI.createTableView({
	top:0,
	width:320,
	height:300,
	data:makeTable()
});
win.add(tableview);
