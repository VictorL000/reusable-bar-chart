# Reusable Bar Graph

This is my reusable bar graph for Jitto, and it can be accessed here [VictorL000.github.io/reusable-bar-graph](https://victorl000.github.io/resable-bar-graph).

## Usage
The component currently accepts 1 mandatory prop and 6 optional props:
   1. Values,
   2. Labels, (defaults to values)
   3. numTicks, (defaults to 10)
   4. yLabel, (defaults to "")
   5. xLabel, (defaults to "")
   6. title, (defaults to "")
   7. darkMode, (defaults to "")

## Features:
- Support for negative numbers
- Light animations
- Hover effects
- Friendly scales
- Dark theme

## Some things to note:
- The text-size scales with the window width, not the draggable demo box.
- The tick algorithm finds the "nicest" tick number (e.g: 1, 2, 5, 10, 20, 50 ...) which can fit all data into the graph.

## Next steps:
- Change the negative numbers so that the 0 is not in the center.
- Add more themes.