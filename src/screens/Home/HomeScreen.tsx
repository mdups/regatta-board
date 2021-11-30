import React, { useContext } from 'react';
import { Colors, Appbar, IconButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { AccountType } from '../../models';
import { BoatHomeScreen } from './BoatHomeScreen';
import { CrewHomeScreen } from './CrewHomeScreen';
import { View, StyleSheet } from 'react-native';
import { Banner } from '../../components/Banner';
import { AdBanner } from '../../components/AdBanner';
import { withBadge } from '../../components/withBadge';
import { observer } from 'mobx-react-lite';
import { ChatStoreContext, UserStoreContext } from '../../../App';

interface Props {
  navigation: StackNavigationProp<any, any>;
}

export const HomeScreen: React.FC<Props> = observer((props) => {
  const userStore = useContext(UserStoreContext);
  const chatStore = useContext(ChatStoreContext);

  const title =
    userStore.user?.type === 'boat'
      ? 'Boat Owner'
      : userStore.user?.type === 'crew'
      ? 'Crew'
      : '';
  const subtitle = userStore.user?.hometown || '';

  const badgeNumber = userStore.user
    ? chatStore.numberOfUnReadMessages(userStore.user)
    : 0;

  const BadgedIcon = withBadge(badgeNumber, {
    onPress: () => {
      props.navigation.navigate('Conversations');
    },
  })(Appbar.Action);

  props.navigation.setOptions({
    headerLeft: () => (
      <IconButton
        icon="account-outline"
        color={Colors.white}
        size={30}
        onPress={() => {
          props.navigation.navigate('Profile');
        }}
      />
    ),
    headerTitle: () => (
      <Appbar.Content
        title= {title}
        subtitle={subtitle}
        style={{ alignItems: 'center' }}
      />
    ),
    headerRight: () => (
      <BadgedIcon
        // @ts-ignore
        icon="message-text-outline"
        color={Colors.white}
        size={30}
        onPress={() => {
          props.navigation.navigate('Conversations');
        }}
      />
    ),
  });

  const renderContent = () => {
    const type: AccountType | undefined = userStore.user?.type;

    if (type === 'boat') {
      return <BoatHomeScreen navigation={props.navigation} />;
    } else if (type === 'crew') {
      return <CrewHomeScreen navigation={props.navigation} />;
    } else {
      return <View />;
    }
  };

  return (
    <View style={styles.container}>
      <Banner text="Please suggest new features and report any bugs to contact@regattaboard.com." />
      {renderContent()}
      <AdBanner
        text={
          'Advertise Here!\nEmail contact@regattaboard.com to get in touch.'
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
