# DevMinDArT

# TODO

07-08: New clone of MindArtMaster.
10-08: 

## FUNCTIONALITY FIXES
- Bug identification and resolution
- Apply digital brush tools to Colourscape (2 hours)

## TO REVIEW
- assets/1 - 8 images (slightly larger than Logo)
  - Can one image file be used?

- window.orientation    : orientation is now depricated.

- consolidate style sheets

- Any similarities with interface.js


## COMMON ASSETS
- Construct a test UI interface based on Catharina's suggestion. (2 hours)
- Apply 1 by 1 to apps (1 hour each app)
- Move all user interface functionality into a main UI framework (Material UI)
  - Includes all save/restart functionality
- All audio tracks in a single repository
- All brushes
- All textures
- All colour palletes in one single file

## Cam's Comments
All I have managed to lock down so far is Sound and Aesthetic updates to the apps (brush functionality, etc). I have pushed about 30% of these so far and am still tinkering with App 1, 2, 4 and 7. However, as pieces of code these only have to do with minor subtle aesthetic parameters and I can work around what you are doing.

So, please feel free to take over the main branch now, and consolidate there.

The scope of works can be broken loosely into these categories:
- Aesthetic changes as per above. As this is only 5% of the workload, and this is in progress, I will finish this by the end of next weekend
- Consolidation/refactoring - as each app was written separately, there is considerable room for this to happen. I imagine you are much more skilled at this than I, so I trust your approach.
- Bug fixing, usability improvements
- Wrapping the app, as you have started. This includes refining the landing page, and also introducing methods to get from the apps to this page.
- Swapping the (many) diverse interfaces with one single set, as per Cath's recent design. Approx 50% of the apps use image based buttons, and 50% standard web buttons. Most of the buttons are just triggering standard JS functions so I dont think its hard to do, but I recommend just making a test UI framework, and then integrating this one by one. I requested Emma and Cath to come up with a consistent framework based on a framework (in this case Material Design was chosen). I will forward Caths email on to you with the ZIP folder that contains assets and guide.
