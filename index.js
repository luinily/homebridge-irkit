var Service;
var Characteristic;
var http = require("http");

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-irkit2", "IRKit", IRKitAccessory);
};


function IRKitAccessory(log, config) {
    this.log = log;

    // url info
    this.irkit_host = config.irkit_host;
    this.on_form = config.on_form;
    this.off_form = config.off_form;
    this.name = config.name;
    this.type = config.type;

    switch (this.type) {
    case "switch":
        this.on_form = config.on_form;
        this.off_form = config.off_form;
        break;
    case "multiswitch":
        this.multiswitch = config.multiswitch;
        break;
    default:
        throw new Error("Unknown homebridge-homekit switch type");
    }
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
        req.on("error", function (response) {
            callback(response);
        });
        req.write(formData);
        req.end();
    },

    setPowerState: function (targetService, powerOn, callback, context) {
        let funcContext = 'fromSetPowerState';
        if (context == funcContext) { // callback safety
            if (callback) {
                callback();
            }
            return;
        }

        var form;
        switch (this.type) {
        case "switch":
            if (powerOn) {
                form = this.on_form;
                this.log("Setting power state to on");
            } else {
                form = this.off_form;
                this.log("Setting power state to off");
            }
            break;
        case "multiswitch":
            this.services.forEach(function (switchService, i) {
                if (i === 0) {
                    return; // skip informationService at index 0
                }

                if (targetService.subtype === switchService.subtype) { // turn on
                    form = this.multiswitch[i - 1].form;
                    this.log(">>>>>>>> " + this.multiswitch[i - 1].name)
                    switchService.getCharacteristic(Characteristic.On).setValue(true, undefined, funcContext);
                } else { // turn off
                    switchService.getCharacteristic(Characteristic.On).setValue(false, undefined, funcContext);
                }
            }.bind(this));
            break;
        }


        this.httpRequest(this.irkit_host, form, function (response) {
            this.log(form)
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
        this.services = [];

        informationService
            .setCharacteristic(Characteristic.Manufacturer, "IRKit Manufacturer")
            .setCharacteristic(Characteristic.Model, "IRKit Model")
            .setCharacteristic(Characteristic.SerialNumber, "IRKit Serial Number");
        this.services.push(informationService);

        switch (this.type) {
        case "switch":
            var switchService = new Service.Switch(this.name);

            switchService
                .getCharacteristic(Characteristic.On)
                .on("set", this.setPowerState.bind(this, switchService));
            this.services.push(switchService)
            break;
        case "multiswitch":
            this.log("[Multiswitch]: " + this.name);
            this.multiswitch.forEach(function (switchItem, i) {
                switch (i) {
                case 0:
                    this.log("---+--- " + switchItem.name);
                    break;
                case this.multiswitch.length - 1:
                    this.log("   +--- " + switchItem.name);
                    break;
                default:
                    this.log("   |--- " + switchItem.name);
                }

                var switchService = new Service.Switch(switchItem.name, switchItem.name);

                // Bind a copy of the setPowerState function that sets 'this' to the accessory and the first parameter
                // to the particular service that it is being called for.
                let boundSetPowerState = this.setPowerState.bind(this, switchService);
                switchService
                    .getCharacteristic(Characteristic.On)
                    .on('set', boundSetPowerState);

                this.services.push(switchService);
            }.bind(this));
            break;
        }
        return this.services
    }
};
