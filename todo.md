
# Deploy
* PI
  - Node
* Build script
  - grunt


# Componenets
* Cookies


# Features
* Fullscreen
* Name
* Notifications for received images 





# ###
# Collections
* Connections
  - Connection

* RequestImages
  - ImageModel

* RepsonseImages
  - ImageModel

# ###
# Views
* CaptureImage
  -> None
  <- ImageModel

* SelectRecipient
  -> ConnectionList
  <- Connection

* DrawImage
  -> ImageModel
  <- ImageModel
  - ColorPicker

* ColorPicker

* ViewImage
  -> ImageModel
  <- None

# ###
# Models
* ConnectionModel
  - name
  - connectionID

* ImageModel
  - dataURI
  - width
  - height
  - ConnectionModel: null 



# ###
# Other
* Socket
  -> ConnectionList
  -> RequestImagesList
  -> ResponseImagesList
* App