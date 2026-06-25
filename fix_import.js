const fs = require('fs');

let path = 'src/screens/MapScreen.js';
let content = fs.readFileSync(path, 'utf8');

const badLine = "import Svg, { Path } from 'react-native-svg'; { useState, useEffect, useRef, useMemo } from 'react';";
const goodLine = "import Svg, { Path } from 'react-native-svg';";

content = content.replace(badLine, goodLine);

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed import syntax error");
