
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

* DoodlePathList
  - DoodlePathModel

# ###
# Views
* CaptureImage [Screen]
  -> None
  <- ImageModel

* SelectRecipient [Screen]
  -> UserCollection, ImageModel
  <- Connection

* DrawImage [Screen]
  -> ImageModel
  <- ImageModel
  - ColorPicker
  - DoodlePathCollection

* ColorPicker [Widget]
  - 

* ViewImage [Screen]
  -> ImageModel
  <- None

* StartView [Screen]
  -> UserModel, UserCollection, RequestImageCollection, ResponseImageCollection
  

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

* DoodlePathModel
  - color
  - size
  - points


# ###
# Other
* Socket
  -> UserModel, UserCollection, RequestImageCollection, ResponseImageCollection

* App
  - Sets up
    + Collections
      * UserCollection
      * ResponseImageCollection
      * RequestImageCollection
    + Views
      * CaptureImage
      * DrawImage
      * ViewImage
      * SelectRecipient