var ff = require('ffef/FatFractal');

function FFUserGroup(name) {
	this.clazz = 'FFUserGroup';
	this.groupName = name;
	return this;
}

function AppUser() {
	this.clazz = 'AppUser';
	this.dob = null;
	this.settings = null;
	return this;
}

var debug = function(msg) {
	print(
		'\n================================================================================\n\n\n\n\n' +
			msg +
			'\n\n\n\n\n================================================================================'
	);
};

// Populate
exports.populate = function() {
	try {
		debug('populating!');
		// Create groups
		createGroup('admin');
		createGroup('patient');
		createGroup('clinician');

		let response = ff.response();
		response.statusMessage = 'Populated successfully';
	} catch (e) {
		throw e;
	}
};

var createGroup = function(name) {
	var query = "/FFUserGroup/(groupName eq '" + name + "')";
	var obj = ff.getObjFromUri(query);

	if (!obj) {
		try {
			var group = new FFUserGroup(name);
			var createdGroup = ff.createObjAtUri(group, '/FFUserGroup');
			var system = ff.getUser('system');
			system.addGroup(createdGroup);
		} catch (e) {
			throw {
				statusCode: 500,
				statusMessage: "Error creating '" + name + "' group",
			};
		}
	}
};

// Users
exports.register = function() {
	// Check Request
	if (ff.getExtensionRequestData().httpMethod !== 'POST') {
		throw { statusCode: 400, statusMessage: 'POST only' };
	}

	if (!ff.getExtensionRequestData().httpContent) {
		throw { statusCode: 400, statusMessage: 'No Body' };
	}

	// Response
	var response = ff.response();

	// Active User
	var au = ff.getActiveUser();
	var rawUser = ff.getExtensionRequestData().httpContent;

	if (!rawUser.role) {
		throw { statusCode: 400, statusMessage: 'role field is mandatory' };
	}

	var appUser = new AppUser();
	
	// DoB
	if (rawUser.dob) appUser.dob = rawUser.dob;
	
	// Settings
	if (rawUser.settings) appUser.settings = rawUser.settings;

	// Password
	var password = rawUser.password;
	delete rawUser.password;

	// Role
	var role = rawUser.role;
	delete rawUser.role;

	// Remove AppUser only properties
	if(rawUser.dob) delete rawUser.dob;
	if(rawUser.settings) delete rawUser.settings;

	debug(rawUser);

	try {
		// Register FFUser
		var active = true;
		var fireEvents = true;
		var createdUser = ff.registerUser(rawUser, password, active, fireEvents);

		// Create AppUser
		var createdAppUser = ff.createObjAtUri(appUser, '/AppUser', createdUser.guid);
		ff.addReferenceToObj(createdUser.ffUrl, 'ffUser', createdAppUser);
		createdAppUser = ff.updateObj(createdAppUser);

		// Add user to group
		var appGroup = ff.getObjFromUri(
			"/FFUserGroup/(groupName eq '" + role + "')"
		);
		ff.FFUserGroup(appGroup).addUser(createdUser);
	} catch (e) {
		if (createdUser) ff.deleteObj(createdUser);
		if (createdAppUser) ff.deleteObj(createdAppUser);
		throw e;
	}

	response.result = createdAppUser;
};