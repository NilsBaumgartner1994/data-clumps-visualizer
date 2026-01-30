<h2 align="center">
    data-clumps-visualizer
</h2>

<p align="center">
    <img src="https://github.com/FireboltCasters/data-clumps-visualizer/raw/master/public/logo.png" alt="backup" style="height:100px;"/>
</p>

<h2 align="center">
Data Clumps Viszualizer
</h2>

<p align="center">
  <a href="https://badge.fury.io/js/data-clumps-visualizer.svg"><img src="https://badge.fury.io/js/data-clumps-visualizer.svg" alt="npm package" /></a>
  <a href="https://img.shields.io/github/license/FireboltCasters/data-clumps-visualizer"><img src="https://img.shields.io/github/license/FireboltCasters/data-clumps-visualizer" alt="MIT" /></a>
  <a href="https://img.shields.io/github/last-commit/FireboltCasters/data-clumps-visualizer?logo=git"><img src="https://img.shields.io/github/last-commit/FireboltCasters/data-clumps-visualizer?logo=git" alt="last commit" /></a>
  <a href="https://www.npmjs.com/package/data-clumps-visualizer"><img src="https://img.shields.io/npm/dm/data-clumps-visualizer.svg" alt="downloads week" /></a>
  <a href="https://www.npmjs.com/package/data-clumps-visualizer"><img src="https://img.shields.io/npm/dt/data-clumps-visualizer.svg" alt="downloads total" /></a>
  <a href="https://github.com/FireboltCasters/data-clumps-visualizer"><img src="https://shields.io/github/languages/code-size/FireboltCasters/data-clumps-visualizer" alt="size" /></a>
  <a href="https://github.com/google/gts" alt="Google TypeScript Style"><img src="https://img.shields.io/badge/code%20style-google-blueviolet.svg"/></a>
  <a href="https://shields.io/" alt="Google TypeScript Style"><img src="https://img.shields.io/badge/uses-TypeScript-blue.svg"/></a>
  <a href="https://github.com/marketplace/actions/lint-action"><img src="https://img.shields.io/badge/uses-Lint%20Action-blue.svg"/></a>
  <a href="https://github.com/FireboltCasters/data-clumps-visualizer/actions/workflows/npmPublish.yml"><img src="https://github.com/FireboltCasters/data-clumps-visualizer/actions/workflows/npmPublish.yml/badge.svg" alt="Npm publish" /></a>
</p>

## About

A library to visualize data clumps which is used in [data-clumps](https://github.com/FireboltCasters/data-clumps).

## Live
Here you can upload and explore your own projects which are parsed by npm [data-clumps](https://fireboltcasters.github.io/data-clumps/):

[https://fireboltcasters.github.io/data-clumps-visualizer/](https://nilsbaumgartner1994.github.io/data-clumps-visualizer/)

## Demo

1. Download a data clumps report. Example: https://raw.githubusercontent.com/NilsBaumgartner1994/Data-Clumps-Dataset/main/Data/Projects/xerces2-j/tags/00a12ead688b1051ce5e9b8390257d53a161c056.json
2. Open visualizer: https://fireboltcasters.github.io/data-clumps-visualizer
3. Drag and drop the data clumps report

<a href="https://fireboltcasters.github.io/data-clumps-visualizer/">
  <img src="https://github.com/FireboltCasters/data-clumps-visualizer/raw/master/docs/demo.gif" alt="backup" style="witdth:100px;"/>
</a>
    

## Installtion

```
npm install data-clumps-visualizer
```

## Usage

Have a look at the development example in [development.ts](https://github.com/FireboltCasters/data-clumps-visualizer/blob/master/src/api/src/ignoreCoverage/development.ts)

```tsx
import React, {useState} from 'react';
import {DataClumpsGraph, ExampleData} from "data-clumps-visualizer";

const from_file_path = null;
const dataClumpsDict = ExampleData.getArgoUML(); // or your own data

export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
å
  render(){
    return (
        <DataClumpsGraph 
                key={JSON.stringify(dataClumpsDict)+from_file_path} 
                from_file_path={from_file_path} 
                dataClumpsDict={dataClumpsDict} 
        />
    );
  }
}

```

## Roadmap

- [x] Integrate website-to-gif: https://github.com/PabloLec/website-to-gif
- [ ] Implement different visualizations
  - [x] simple graph visualization
- [ ] Implement visualization to jpg
- [ ] Add sidebar menu to select specific file/class/method
- [ ] Server side image generation


## License

All Rights Reserved.

Copyright (c) 2023 Nils Baumgartner

No part of this software may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the copyright holder, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.

For permission requests, please contact the copyright holder at nilsbaumgartner1994@gmail.com



## Contributors

The FireboltCasters

<a href="https://github.com/FireboltCasters/data-clumps-visualizer"><img src="https://contrib.rocks/image?repo=FireboltCasters/data-clumps-visualizer" alt="Contributors" /></a>
