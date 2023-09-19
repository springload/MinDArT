# DevMinDArT

# UPDATING THE PACKAGE
1. Update 'manifest.json'
  - "Start_URL", "Short Name", Icons "src" 
2. Run `npm run build` to generate the new package in './dist/' folder (this will also update the version number)
3. Update menu URL path in 'functions.js'.

# TODO



## FUNCTIONALITY FIXES
- Bug identification and resolution
- Apply digital brush tools to Colourscape (2 hours)

## TO REVIEW
- assets/1 - 8 images (slightly larger than Logo)
  - Can one image file be used?

- window.orientation    : orientation is now depricated.

- consolidate style sheets

- Any similarities with interface.js


## Cam's Comments
All I have managed to lock down so far is Sound and Aesthetic updates to the apps (brush functionality, etc). I have pushed about 30% of these so far and am still tinkering with App 1, 2, 4 and 7. However, as pieces of code these only have to do with minor subtle aesthetic parameters and I can work around what you are doing.

So, please feel free to take over the main branch now, and consolidate there.

The scope of works can be broken loosely into these categories:
- Aesthetic changes as per above. As this is only 5% of the workload, and this is in progress, I will finish this by the end of next weekend
- Consolidation/refactoring - as each app was written separately, there is considerable room for this to happen. I imagine you are much more skilled at this than I, so I trust your approach.
- Bug fixing, usability improvements
- Swapping the (many) diverse interfaces with one single set, as per Cath's recent design. Approx 50% of the apps use image based buttons, and 50% standard web buttons. Most of the buttons are just triggering standard JS functions so I dont think its hard to do, but I recommend just making a test UI framework, and then integrating this one by one. I requested Emma and Cath to come up with a consistent framework based on a framework (in this case Material Design was chosen). I will forward Caths email on to you with the ZIP folder that contains assets and guide.
