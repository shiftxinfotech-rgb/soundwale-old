import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
type VectorIconParams = {
  iconSize: number;
  iconColor: string;
  iconType: number;
  iconName: string;
};

const VectorIcon = ({
  iconSize,
  iconColor,
  iconType,
  iconName,
}: VectorIconParams) => {
  switch (iconType) {
    case 1:
      return <AntDesign size={iconSize} color={iconColor} name={iconName} />;
    case 2:
      return <Entypo size={iconSize} color={iconColor} name={iconName} />;
    case 3:
      return <Feather size={iconSize} color={iconColor} name={iconName} />;
    case 4:
      return (
        <MaterialIcons size={iconSize} color={iconColor} name={iconName} />
      );
    case 5:
      return (
        <MaterialCommunityIcons
          size={iconSize}
          color={iconColor}
          name={iconName}
        />
      );
    case 6:
      return <Octicons size={iconSize} color={iconColor} name={iconName} />;
    case 7:
      return <Ionicons size={iconSize} color={iconColor} name={iconName} />;
    default:
      return <></>;
  }
};

export {VectorIcon};
