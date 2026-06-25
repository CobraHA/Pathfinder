const fs = require('fs');
let path = 'src/screens/MapScreen.js';
let content = fs.readFileSync(path, 'utf8');

// Add SVG import
if (!content.includes("react-native-svg")) {
    content = content.replace("import React,", "import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';\nimport Svg, { Path } from 'react-native-svg';");
    content = content.replace("import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';", ""); // cleanup duplicate
}

// Add BrokenTshirtIcon component right before MemoizedQuestMarker
const brokenTshirtComp = `
const BrokenTshirtIcon = ({ size, color }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size}>
    <Path
      fill={color}
      d="M12.83,5.97 C12.59,6.58 12.03,7 11.39,7 C10.74,7 10.18,6.58 9.94,5.97 L5.5,7.5 V11.5 L7,11 V17 L8,14 L10,19 L12,15 L14,19 L15,16 L16,18 V11 L17.5,11.5 V7.5 L12.83,5.97 Z"
    />
  </Svg>
);

const MemoizedQuestMarker`;
content = content.replace("const MemoizedQuestMarker", brokenTshirtComp);

// Use broken-tshirt
content = content.replace(/iconName = 'tshirt-crew-outline';/g, "iconName = 'broken-tshirt';");

// Update rendering logic in MemoizedQuestMarker
const oldRender = `<MaterialCommunityIcons name={iconName} size={18} color={iconColor} />`;
const newRender = `{iconName === 'broken-tshirt' ? (
          <BrokenTshirtIcon size={18} color={iconColor} />
        ) : (
          <MaterialCommunityIcons name={iconName} size={18} color={iconColor} />
        )}`;
content = content.replace(oldRender, newRender);

// Update floating text rendering logic
const oldFloatingRender = `<MaterialCommunityIcons name={item.icon} size={16} color={item.color} />`;
const newFloatingRender = `{item.icon === 'broken-tshirt' ? (
              <BrokenTshirtIcon size={16} color={item.color} />
            ) : (
              <MaterialCommunityIcons name={item.icon} size={16} color={item.color} />
            )}`;
content = content.replace(oldFloatingRender, newFloatingRender);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched MapScreen to use custom BrokenTshirtIcon SVG");
