# homebridge-irkit

Supports IRKit on HomeBridge Platform.  
IRKitをSiri(Homekit)で操作するやつ。オン/オフの切り替えが可能になります。  

IRKit HomePage  
http://getirkit.com/  

# Installation

1. Install homebridge using: sudo npm install -g homebridge
2. Install this plugin using: sudo npm install -g homebridge-irkit
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
            "off_form": {"format":"raw","freq":38,"data":[]}
        }
    ]

```

# Attention
If infrared is too long, IRKit may error.  
IRKit に送る赤外線情報が長い場合、エラーになるので注意。
