import React, { useContext } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import {
  BoatSNNSStoreContext,
  ChatStoreContext,
  LocationsStoreContext,
  UserStoreContext,
} from '../../../App';
import { observer } from 'mobx-react-lite';

interface Props {
  navigation: StackNavigationProp<any, any>;
}

export const SettingsScreen: React.FC<Props> = observer((props) => {
  const userStore = useContext(UserStoreContext);
  const chatStore = useContext(ChatStoreContext);
  const locationsStore = useContext(LocationsStoreContext);
  const crewSNNSStore = useContext(BoatSNNSStoreContext);
  const boatSNNSStore = useContext(BoatSNNSStoreContext);

  const onPressAbout = () => {
    props.navigation.navigate('About');
  };

  const onPressLogout = () => {
    userStore.logout();
    AsyncStorage.removeItem('user_access_token');
    boatSNNSStore.reset();
    crewSNNSStore.reset();
    chatStore.reset();
    locationsStore.reset();
    props.navigation.replace('Welcome');
  };

  const renderItem = (title: string, icon: string, callback: Function) => {
    return (
      <TouchableOpacity style={styles.row} onPress={() => callback()}>
        <IconButton disabled icon={icon} size={28} />
        <View style={styles.innerRow}>
          <Text style={styles.textStyle}>{title}</Text>
          <IconButton disabled icon="chevron-right" size={28} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      {renderItem('About', 'information-outline', () => onPressAbout())}
      {renderItem('Logout', 'logout-variant', () => onPressLogout())}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
  },
  innerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 12,
    marginBottom: 4,
  },
  textStyle: {
    fontSize: 18,
  },
});
