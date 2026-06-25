import React from 'react';
import Svg, { Path } from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const BrokenTshirtIcon = ({ size, color }) => (
  <Svg viewBox="3 4 17 17" width={size} height={size}>
    <Path
      fill={color}
      d="M12.83,5.97 C12.59,6.58 12.03,7 11.39,7 C10.74,7 10.18,6.58 9.94,5.97 L5.5,7.5 V11.5 L7,11 V17 L8,14 L10,19 L12,15 L14,19 L15,16 L16,18 V11 L17.5,11.5 V7.5 L12.83,5.97 Z"
    />
  </Svg>
);

export const GameIcon = ({ name, size, color }) => {
  if (name === 'broken-tshirt') {
    return <BrokenTshirtIcon size={size} color={color} />;
  }
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
};
