# LAAS Ring-Lock — 3D viewer for Antonio

A standalone local viewer using the corrected v8 Rhino geometry, with steel, black and copper finishes.

## Run locally

From this folder, start a static server:

```sh
python3 -m http.server 4193 --bind 127.0.0.1
```

Open http://127.0.0.1:4193/ in your browser. Use HTTP rather than opening `index.html` directly, because the viewer loads ES modules and the model data.

No build step, npm packages, API keys or external services are required. The viewer and its dependencies are included in this folder.

## Controls

- Drag the model to rotate it; scroll to zoom.
- Choose Steel, Black or Copper.
- Start/pause rotation and reset to the hero angle.
- “Rhino original” shows the supplied 4500 × 4500 reference render for the selected finish.
- “Save 4K image” exports the current 3D view. In reference mode, “Download render” downloads the original Rhino PNG.

## What is included

- `index.html`: viewer and controls.
- `lock.json` / `lock.bin`: exported model geometry and material data.
- `*-rhino-original.png`: the three original v8 Rhino hero renders.
- `vendor/`: Three.js r180 and its room-lighting environment.

The colour and lighting are the earlier preview settings Marcus asked to restore. The corrected camera and double-sided lettering display are retained. The realtime materials are an approximation; use the original Rhino renders as the appearance reference. The CAD source was not modified. These files do not include an editable Rhino model or an MP4 video.

## Hosting

Serve this directory unchanged from any static web server. Keep the relative paths and the `vendor` directory intact. A GitHub repository link lets collaborators fetch the files; it does not itself run the viewer.

Three.js is distributed under the MIT license; see `vendor/LICENSE`.
