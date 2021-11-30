import React from 'react';
import { View, Text, StyleSheet, Image, Linking} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
interface Props {
  text: string;
}
/*
TODO:
1) set up firebase with links + photos to pull from
*/
export const AdBanner: React.FC<Props> = ({ text }) => {
  return (
    <TouchableOpacity onPress={() => Linking.openURL("https://www.bing.com").catch(err => console.error("Couldn't load page", err))}>
      <View style={styles.container}>
       <Image source={{
          width: 400,
          height: 75,
         uri: "https://picsum.photos/200/300"}} />
      
     </View>
    </TouchableOpacity>
  );
};

/*<Text style={styles.text}>{text}</Text>*/
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    paddingBottom: 0,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});
