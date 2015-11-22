# homebridge-irkit

Supports IRKit on HomeBridge Platform(base on homebridge-http)  
IRKitをSiri(Homekit)で操作するやつ。オン/オフの切り替えが可能になります。  

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g https://github.com/senyoltw/homebridge-irkit
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

Configuration sample:

 ```
"accessories": [
        {
            "accessory": "IRKit",
            "name": "irkit control device",
            "irkit_url": "http://irkitxxxxx.local/messages",
            "on_form": {"format":"raw","freq":38,"data":[]},
            "off_form": {"format":"raw","freq":38,"data":[]},
        }
    ]

```