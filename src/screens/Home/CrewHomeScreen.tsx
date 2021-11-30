/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  ActivityIndicator,
  Card,
  Button,
  IconButton,
} from 'react-native-paper';
import { ISNN } from '../../models';
import { StackNavigationProp } from '@react-navigation/stack';
import { reportTimeToFullString } from '../../utils/datetime_utils';
import { observer } from 'mobx-react-lite';
import {
  UserStoreContext,
  ChatStoreContext,
  LocationsStoreContext,
  CrewSNNSStoreContext,
} from '../../../App';
import AvaliableSwitch from '../../components/AvaliableSwitch'

interface Props {
  navigation: StackNavigationProp<any, any>;
}

export const CrewHomeScreen: React.FC<Props> = observer((props) => {
  const crewSNNSStore = useContext(CrewSNNSStoreContext);
  const userStore = useContext(UserStoreContext);
  const chatStore = useContext(ChatStoreContext);
  const locationsStore = useContext(LocationsStoreContext);

  useEffect(() => {
    if (crewSNNSStore.shouldFetch) {
      crewSNNSStore.fetchAllSNNS();
    }
    if (chatStore.shouldFetch) {
      chatStore.getConversations();
    }
    if (locationsStore.shouldFetch) {
      locationsStore.fetchLocations();
    }
  }, []);

  const handleAccept = async (item: ISNN) => {
    if (userStore.shouldFetch) {
      await userStore.getCurrentUser();
    }
    if (!userStore.user!.name) {
      Alert.alert(
        'Need more information',
        'In order to accept a Crew Alert, you must at least provide your full name. Tap on the profile button in the top left corner to finish filling out your profile.',
        [{ text: 'Close', onPress: () => undefined }],
      );
      return;
    }

    await crewSNNSStore.handleAccept(item, userStore.user!);
    crewSNNSStore.fetchAllSNNS(true);
  };

  const handleDecline = async (item: ISNN) => {
    await crewSNNSStore.handleDecline(item, userStore.user!);
    crewSNNSStore.fetchAllSNNS(true);
  };

  const showErrorDialog = (error: string) => {
    Alert.alert('Error', error + '.', [
      { text: 'Close', onPress: () => undefined },
    ]);
  };

  const renderField = (
    iconStr: string,
    data: string,
    width50: boolean = true,
  ) => {
    return (
      <View style={[styles.fieldContainer, { width: width50 ? '50%' : '90%' }]}>
        <IconButton icon={iconStr} disabled style={styles.fieldIcon} />
        <Text>{data}</Text>
      </View>
    );
  };

  const renderStatus = (
    item: ISNN,
    index: number,
    selected: boolean,
    hasAccepted: boolean,
    hasDeclined: boolean,
    hasBeenEliminated: boolean,
  ) => {
    if (hasDeclined) {
      return (
        <View style={styles.buttonWrapper}>
          <Text style={styles.declinedText}>Declined Offer</Text>
        </View>
      );
    }

    if (hasBeenEliminated) {
      return (
        <View style={styles.buttonWrapper}>
          <Text style={styles.declinedText}>Not Selected</Text>
        </View>
      );
    }

    if (selected) {
      return (
        <View style={styles.textWrapper}>
          <Text style={styles.acceptedText}>You have been selected!</Text>
          <Text style={styles.contactInfoText}>
            Boat Owner Contact Information:
          </Text>
          <View style={styles.fieldRow}>
            {renderField('account', item.user.name)}
          </View>
        </View>
      );
    }

    return hasAccepted ? (
      <View style={styles.buttonWrapper}>
        <Text style={styles.acceptedText}>
          Accepted Offer{'\n'}awaiting response
        </Text>
      </View>
    ) : (
      <View style={styles.buttonWrapper}>
        <Button
          style={styles.acceptButton}
          mode="contained"
          onPress={() => handleAccept(item)}>
          Accept
        </Button>
        <Button
          style={styles.declineButton}
          mode="contained"
          onPress={() => handleDecline(item)}>
          Decline
        </Button>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: ISNN; index: number }) => {
    const currUID = userStore.user!.id;
    const hasAccepted = !!item.acceptedCrew.find((v) => v.id === currUID);
    const hasDeclined = !!item.declinedCrew.find((v) => v.id === currUID);
    const hasBeenEliminated =
      !!item.eliminatedCrew.find((v) => v.id === currUID) ||
      (!!item.selectedCrew && item.selectedCrew.id !== currUID);
    const selected = !!item.selectedCrew && item.selectedCrew.id === currUID;

    return (
      <Card
        key={index}
        style={[
          styles.pendingContainer,
          index === crewSNNSStore.snnsAtLocation.length - 1 && {
            marginBottom: 20,
          }, // last one in list
        ]}>
        <Text style={styles.headerText}>
          {selected
            ? 'Selected as ' + item.positionNeeded + '!'
            : 'New Crew Alert'}
        </Text>
        <Text style={styles.bodyText}>
          {item.boatName + ' (' + item.boatClass + ')'} needs a{' '}
          {item.positionNeeded.toLowerCase()} for {item.type} on{' '}
          {reportTimeToFullString(item.reportTime)} in {item.location} at{' '}
          {item.site}
        </Text>
        <View style={styles.notesWrapper}>
          <Text style={styles.notesHeaderText}>Notes from owner: </Text>
          <Text style={styles.notesText} numberOfLines={0}>
            {item.notes || 'No notes'}
          </Text>
        </View>
        {renderStatus(
          item,
          index,
          selected,
          hasAccepted,
          hasDeclined,
          hasBeenEliminated,
        )}
      </Card>
    );
  };

  var snnsAtLocation: ISNN[] | undefined;
  if (crewSNNSStore.snns) {
    if (userStore.user) {
      snnsAtLocation = crewSNNSStore.snnsAtLocation(
        userStore.user.hometown,
        userStore.user.sailingTypes,
      );
    } else {
      snnsAtLocation = crewSNNSStore.snnsAtLocation();
    }
  }

  if (crewSNNSStore.error) {
    showErrorDialog(crewSNNSStore.error);
  } else if (userStore.error) {
    showErrorDialog(userStore.error);
  }

  if (crewSNNSStore.isLoading || userStore.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (userStore.user && userStore.user.sailingTypes?.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, textAlign: 'center', margin: 18 }}>
          No notifications in your location.{'\n'}
          You won't see any notifications until you select at least one sailing
          type in your profile.
        </Text>
        <Button mode="contained" onPress={() => crewSNNSStore.fetchAllSNNS()}>
          Refresh
        </Button>
      </View>
    );
  }

  if (snnsAtLocation && snnsAtLocation.length === 0 && !crewSNNSStore.error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, textAlign: 'center', margin: 18 }}>
          No notifications in your location. Check back later!{'\n'}
          Or you can check out other locations by changing the location you have
          set in your profile.
        </Text>
        <Button mode="contained" onPress={() => crewSNNSStore.fetchAllSNNS()}>
          Refresh
        </Button>
        <AvaliableSwitch/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={snnsAtLocation!}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={crewSNNSStore.isRefreshing}
            onRefresh={() => crewSNNSStore.fetchAllSNNS(true)}
          />
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    width: '90%',
  },
  pendingContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#a3b8c8',
    marginTop: 20,
    elevation: 4,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 22,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bodyText: {
    fontSize: 18,
    paddingHorizontal: 14,
    paddingBottom: 14,
    textAlign: 'center',
  },
  textWrapper: {
    flexDirection: 'column',
    margin: 12,
    alignItems: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 12,
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  declineButton: {
    backgroundColor: 'red',
  },
  acceptedText: {
    fontSize: 24,
    color: 'green',
    textAlign: 'center',
  },
  declinedText: {
    fontSize: 24,
    color: 'red',
    textAlign: 'center',
  },
  contactInfoText: {
    fontSize: 16,
    margin: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -8,
  },
  fieldIcon: {
    marginRight: 6,
  },
  notesWrapper: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  notesHeaderText: {
    marginRight: 4,
  },
  notesText: {
    flex: 1,
    flexWrap: 'wrap',
  },
});
