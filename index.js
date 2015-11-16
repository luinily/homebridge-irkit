var Service, Characteristic;
var request = require("request");

module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-http", "Http", HttpAccessory);
}


function HttpAccessory(log, config) {
	this.log = log;

	// url info
	this.on_url    = config["on_url"];
	this.on_body   = config["on_body"];
	this.off_url   = config["off_url"];
	this.off_body  = config["off_body"];
	this.http_method = config["http_method"];
	this.name = config["name"];
}

HttpAccessory.prototype = {

	httpRequest: function(url, body, method, callback) {
		request({
				url: url,
				body: body,
				method: method,
			},
			function(error, response, body) {
				callback(error, response, body)
			})
	},

	setPowerState: function(powerOn, callback) {
		var url;
		var body;

		if (powerOn) {
			url = this.on_url;
			body = this.on_body;
			this.log("Setting power state to on");
		} else {
			url = this.off_url;
			body = this.off_body;
			this.log("Setting power state to off");
		}

		this.httpRequest(url, body, this.http_method, function(error, response, responseBody) {
			if (error) {
				this.log('HTTP power function failed: %s', error.message);
				callback(error);
			} else {
				this.log('HTTP power function succeeded!');
				this.log(response);
				this.log(responseBody);
	
				callback();
			}
		}.bind(this));
	},

	identify: function(callback) {
		this.log("Identify requested!");
		callback(); // success
	},

	getServices: function() {

		// you can OPTIONALLY create an information service if you wish to override
		// the default values for things like serial number, model, etc.
		var informationService = new Service.AccessoryInformation();

		informationService
			.setCharacteristic(Characteristic.Manufacturer, "HTTP Manufacturer")
			.setCharacteristic(Characteristic.Model, "HTTP Model")
			.setCharacteristic(Characteristic.SerialNumber, "HTTP Serial Number");

		var switchService = new Service.Switch(this.name);

		switchService
			.getCharacteristic(Characteristic.On)
			.on('set', this.setPowerState.bind(this));

		return [switchService];
	}
};
