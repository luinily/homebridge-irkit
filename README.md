# homebridge-irkitExtended

Supports IRKit on HomeBridge Platform.  

Fork from homebridge-irkit (https://github.com/senyoltw/homebridge-irkit/)

Used radio-button like implementation by homebridge-switcheroo (https://github.com/chriszelazo/homebridge-switcheroo)

On/Off for IR devices

Radio-button like option for IR devices with multiple states

IRKit HomePage  
http://getirkit.com/  

# Installation
1. Install homebridge using: sudo npm install -g homebridge
2. Install this plugin using: sudo npm install -g homebridge-irkitextended
3. Update your configuration file. See sample-config.json in this repository for a sample.

# Configuration

Configuration sample:

 ```
"accessories": [
      {
          "accessory": "IRKitExt",
          "name": "irkit control device simple",
          "irkit_host": "irkitxxxxx.local",
          "type": "simple",
          "on_form": {"format":"raw","freq":38,"data":[]},
			       "off_form":{"format":"raw","freq":38,"data":[]}
      },
      {
          "accessory": "IRKitExt",
          "name": "irkit control device multistate",
          "irkit_host": "irkitxxxxx.local",
          "type": "multiple",
          "multiple": [
            {
                "name" : "Off",
                "form":  {"format":"raw","freq":38,"data":[]}
            },
            {
                "name" : "Low",
                "form":  {"format":"raw","freq":38,"data":[]}
            },
            {
                "name" : "Medium",
                "form": {"format":"raw","freq":38,"data":[]}
            },
            {
                "name" : "High",
                "form": {"format":"raw","freq":38,"data":[]}
            }
          ]
      }
    ]
```
