/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { IUserData, ISNN } from '../../models';
import {
  IconButton,
  Card,
  Button,
  ActivityIndicator,
  FAB
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { reportTimeToFullString } from '../../utils/datetime_utils';
import { humanizeWord } from '../../utils/string_utils';
import { observer } from 'mobx-react-lite';
import {
  BoatSNNSStoreContext,
  ChatStoreContext,
  LocationsStoreContext,
  UserStoreContext,
} from '../../../App';
import AvaliableTable from '../../components/AvaliableTable'

interface Props {
  navigation: StackNavigationProp<any, any>;
}

export const BoatHomeScreen: React.FC<Props> = observer((props) => {
  const boatSNNSStore = useContext(BoatSNNSStoreContext);
  const userStore = useContext(UserStoreContext);
  const chatStore = useContext(ChatStoreContext);
  const locationsStore = useContext(LocationsStoreContext);

  useEffect(() => {
    if (boatSNNSStore.shouldFetch) {
      boatSNNSStore.fetchAllSNNSForUser();
    }
    if (chatStore.shouldFetch) {
      chatStore.getConversations();
    }
    if (locationsStore.shouldFetch) {
      locationsStore.fetchLocations();
    }
  }, []);

  const navigateToCreateSNNScreen = async () => {
    if (userStore.shouldFetch) {
      await userStore.getCurrentUser();
    }

    if (userStore.error) {
      showAlert('Error', userStore.error + '.');
      return;
    }

    if (userStore.user) {
      if (!!userStore.user.name && !!userStore.user.hometown) {
        props.navigation.navigate('CreateSNN');
      } else {
        showAlert(
          'Need more information',
          'Tap on the profile button in the top left corner to finish filling out your profile. You must provide your full name and location in order to send out a Crew Alert.',
        );
      }
    }
  };

  const navigateToEditSSNScreen = async (snn: ISNN) => {
    if (userStore.shouldFetch) {
      await userStore.getCurrentUser();
    }

    if (userStore.error) {
      showAlert('Error', userStore.error + '.');
      return;
    }

    if (userStore.user) {
      props.navigation.navigate('EditSNN', { snn: snn });
    }
  };

  const showAlert = (title: string, body: string) => {
    Alert.alert(title, body, [{ text: 'Close', onPress: () => undefined }]);
  };

  const showDeleteConfirmation = (snn: ISNN) => {
    Alert.alert(
      'Delete Crew Alert',
      'Are you sure to want to delete this Crew Alert? If you have already selected a crew member, please inform them of the cancellation.',
      [
        {
          text: 'Delete',
          onPress: async () => {
            boatSNNSStore.deleteSNN(snn);
          },
          style: 'destructive',
        },
        { text: 'Cancel', onPress: () => undefined },
      ],
    );
  };

  const handleSelectCrew = async (snn: ISNN, item: IUserData) => {
    await boatSNNSStore.handleSelectCrew(snn, item);
    boatSNNSStore.fetchAllSNNSForUser(true);
  };

  const showDeclineCrewAlert = (snn: ISNN, item: IUserData) => {
    Alert.alert(
      'Decline Potential Crew Member',
      `Are you sure to want to decline ${item.name}? Once you decline, you can no longer select this crew member.`,
      [
        {
          text: 'Decline',
          onPress: async () => {
            await boatSNNSStore.handleDeclineCrew(snn, item);
            boatSNNSStore.fetchAllSNNSForUser(true);
          },
          style: 'destructive',
        },
        { text: 'Cancel', onPress: () => undefined },
      ],
    );
  };

  const showErrorDialog = () => {
    Alert.alert('Error', boatSNNSStore.error + '.', [
      { text: 'Close', onPress: () => undefined },
    ]);
  };

  const renderMessageButton = (userId: string) => {
    return (
      <Card style={styles.messageButton}>
        <IconButton
          icon="comment-arrow-right-outline"
          size={32}
          onPress={() => {
            chatStore.findOrCreateConversation(userId).then(() => {
              props.navigation.navigate('Chat');
            });
          }}
        />
      </Card>
    );
  };

  const renderField = (
    iconStr: string,
    data: string,
    width50: boolean = true,
  ) => {
    return (
      <View style={[styles.fieldContainer, { width: width50 ? '50%' : '90%' }]}>
        <IconButton icon={iconStr} disabled style={styles.fieldIcon} />
        <Text ellipsizeMode="head">{data}</Text>
      </View>
    );
  };

  const renderAcceptedCrewContent = (item: IUserData) => {
    return (
      <View style={styles.acceptedCrewContentRow}>
        <View style={styles.acceptedCrewContentColumn}>
          {renderField(
            'account-star',
            item.experience || 'No experience stated',
          )}
          {renderField(
            'weight',
            item.weight ? item.weight + ' lbs.' : 'No weight given',
          )}
        </View>
        <View style={styles.messageButtonWrapper}>
          {renderMessageButton(item.id)}
        </View>
      </View>
    );
  };

  const renderAcceptedCrew = (
    { item, index }: { item: IUserData; index: number },
    snn: ISNN,
    selected: boolean,
  ) => {
    return (
      <Card key={index} style={styles.crewContainer}>
        <Text style={styles.acceptedNameText}>{item.name}</Text>
        {renderAcceptedCrewContent(item)}
        {!selected && (
          <View style={styles.buttonWrapper}>
            <Button
              style={styles.selectButton}
              mode="contained"
              onPress={() => handleSelectCrew(snn, item)}>
              Select
            </Button>
            <Button
              style={styles.selectButton}
              mode="contained"
              color="red"
              onPress={() => showDeclineCrewAlert(snn, item)}>
              Decline
            </Button>
          </View>
        )}
      </Card>
    );
  };

  const renderListItem = ({ item, index }: { item: ISNN; index: number }) => {
    let usersToDisplay: IUserData[] = [];

    if (item.selectedCrew) {
      usersToDisplay = [item.selectedCrew];
    } else {
      usersToDisplay = item.acceptedCrew.filter(
        (c) => !item.eliminatedCrew.find((e) => e.id === c.id),
      );
    }

    return (
      <Card
        key={index}
        style={styles.snnContainer}
        onPress={() => navigateToEditSSNScreen(item)}
        onLongPress={() => showDeleteConfirmation(item)}>
        <Text style={styles.itemTitleText}>Crew Alert</Text>
        <View style={styles.fieldRow}>
          {renderField(
            'ship-wheel',
            item.boatName + ' (' + item.boatClass + ')',
          )}
          {renderField('account', item.positionNeeded)}
        </View>
        <View style={styles.fieldRow}>
          {renderField('map-outline', item.location)}
          {renderField(
            'clock-outline',
            reportTimeToFullString(item.reportTime, true),
          )}
        </View>
        <View style={styles.fieldRow}>
          {renderField('map-marker', item.site || 'No location given')}
          {renderField('cup-water', humanizeWord(item.type))}
        </View>
        <View style={{ ...styles.fieldRow, marginRight: 24 }}>
          {renderField('note-outline', item.notes || 'No notes', false)}
        </View>
        <Text style={styles.acceptedText}>
          {item.selectedCrew
            ? 'Selected Crew Member:'
            : 'Potential Crew Members:'}
        </Text>
        {usersToDisplay.length > 0 ? (
          <FlatList
            data={usersToDisplay}
            scrollEnabled={false}
            renderItem={(obj: { item: IUserData; index: number }) =>
              renderAcceptedCrew(obj, item, !!item.selectedCrew)
            }
          />
        ) : (
          <Text style={styles.emptyText}>
            No Crew Members have accepted yet!
          </Text>
        )}
      </Card>
    );
  };

  if (boatSNNSStore.error) {
    showErrorDialog();
  }
  if (boatSNNSStore.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  if (
    boatSNNSStore.snns &&
    boatSNNSStore.snns.length === 0 &&
    !boatSNNSStore.error
  ) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#ffff' }}>
        <View style={{
          flex: 2,
          width: '100%',
          padding: 5,
          alignItems: 'center'
        }}>
          
          <AvaliableTable navigation={props.navigation}></AvaliableTable>

      </View>
        <Text style={{ fontSize: 20, flex:1, backgroundColor: '#ffff', textAlign: 'center', margin: 18 }}>
          Looks like you haven't sent out any notifications yet. Tap the button
          in the bottom right corner to get started.
        </Text>
        <FAB
          style={styles.fab}
          icon="comment-plus-outline"
          onPress={() => navigateToCreateSNNScreen()}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={boatSNNSStore.snns}
        renderItem={renderListItem}
        refreshControl={
          <RefreshControl
            refreshing={boatSNNSStore.isRefreshing}
            onRefresh={() => boatSNNSStore.fetchAllSNNSForUser(true)}
          />
        }
      />
      <FAB
        style={styles.fab}
        icon="comment-plus-outline"
        onPress={() => navigateToCreateSNNScreen()}
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
  fab: {
    backgroundColor:'rgb(3,119,189)',
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
  },
  list: {
    flex: 1,
    marginHorizontal: 16,
  },
  snnContainer: {
    marginVertical: 10,
    backgroundColor: '#a3b8c8',
    flexDirection: 'column',
  },
  itemTitleText: {
    fontSize: 16,
    alignSelf: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -6,
  },
  fieldIcon: {
    marginRight: 6,
  },
  acceptedText: {
    fontSize: 20,
    margin: 14,
    marginBottom: 4,
  },
  crewContainer: {
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#4C9A2A',
    paddingVertical: 12,
  },
  acceptedNameText: {
    paddingHorizontal: 12,
    fontSize: 18,
    paddingBottom: 4,
    alignSelf: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 6,
  },
  selectButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
  emptyText: {
    alignSelf: 'center',
    marginVertical: 24,
    fontSize: 16,
  },
  declinedText: {
    fontSize: 22,
    color: 'red',
  },
  acceptedCrewContentRow: {
    flexDirection: 'row',
  },
  acceptedCrewContentColumn: {
    flexDirection: 'column',
    width: '75%',
  },
  messageButtonWrapper: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  messageButton: {
    width: 50,
    height: 50,
    paddingBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    elevation: 4,
    marginRight: 16,
  },
});
