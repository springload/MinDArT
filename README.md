# MindArtMaster

# TODO

## FUNCTIONALITY FIXES
- Colour contrast issues in multiple apps
- Bug identification and resolution

## COMMON ASSETS
- Move all user interface functionality into a main UI framework (Material UI)
  - Includes all save/restart functionality
- All audio tracks in a single repository
- All brushes
- All textures
- All colour palletes in one single file
-

## OFFLINE / KIOSK / PWA
- Find the right approach to having the apps either as a hybrid app, or a PWA.
- https://makelemonapp.com/beginners-guide-to-apps-native-vs-hybrid-vs-pwa/
- The functionality we are looking for us very simple, we just need the group of web pages to act as an offline app.
- A bonus is that we enter a Kiosk mode
- I was tempted to use an off the shelf Kiosk wrapper (like https://www.fully-kiosk.com/) to effectively turn the tablets into a Kiosk displaying only one app (therefore reducing the visual noise of the overall tablet)
  - it is complicated by the need to go offline, and by the fact that we ideally want to save the images somewhere local to the device.
  - we could save to a cloud, but we decided to not pursue this for now for other usability/ethical reasons (passwords, privacy)
