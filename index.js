var Service, Characteristic;
var http = require("http");

module.exports = function (homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-irkit", "IRKit", IRKitAccessory);
}


function IRKitAccessory(log, config) {
	this.log = log;

	// url info
	this.irkit_host = config["irkit_host"];
	this.on_form = config["on_form"];
	this.off_form = config["off_form"];
	this.name = config["name"];
}

IRKitAccessory.prototype = {

	httpRequest: function (host, form, callback) {
		var formData = JSON.stringify(form);
		var req = http.request({
			host: host,
			path: "/messages",
			method: "POST",
			headers: {
				"X-Requested-With": "homebridge-irkit",
				"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
				"Content-Length": formData.length
			}
		}, function (response) {
			callback(response);
		});
		req.on('error', function (response) {
			callback(response);
		});
		req.write(formData);
		req.end();
	},

	setPowerState: function (powerOn, callback) {
		var form;

		if (powerOn) {
			form = this.on_form;
			this.log("Setting power state to on");
		} else {
			form = this.off_form;
			this.log("Setting power state to off");
		}

		this.httpRequest(this.irkit_host, form, function (response) {
			if (response.statusCode == 200) {
				this.log('IRKit power function succeeded!');

				callback();
			} else {
				this.log(response.message);
				this.log('IRKit power function failed!');

				callback('error');
			}
		}.bind(this));
	},

	identify: function (callback) {
		this.log("Identify requested!");
		callback(); // success
	},

	getServices: function () {

		// you can OPTIONALLY create an information service if you wish to override
		// the default values for things like serial number, model, etc.
		var informationService = new Service.AccessoryInformation();

		informationService
			.setCharacteristic(Characteristic.Manufacturer, "IRKit Manufacturer")
			.setCharacteristic(Characteristic.Model, "IRKit Model")
			.setCharacteristic(Characteristic.SerialNumber, "IRKit Serial Number");

		var switchService = new Service.Switch(this.name);

		switchService
			.getCharacteristic(Characteristic.On)
			.on('set', this.setPowerState.bind(this));

		return [switchService];
	}
};
