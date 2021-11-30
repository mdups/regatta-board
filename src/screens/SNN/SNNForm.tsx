import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LocationsStoreContext, UserStoreContext } from '../../../App';
import { observer } from 'mobx-react-lite';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SAILING_TYPES, ISNN } from '../../models';
import { dateToString, timeToString } from '../../utils/datetime_utils';
import { humanizeWord } from '../../utils/string_utils';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { Colors, TextInput, Button } from 'react-native-paper';

const sailingTypes = SAILING_TYPES.map((t) => ({
  value: t,
  label: humanizeWord(t),
}));

interface Props {
  navigation: StackNavigationProp<any, any>;
  editMode: boolean;
  snn?: ISNN;
  onSubmit: (
    snn: Partial<ISNN>,
    showLocationWarning: boolean,
    reportDate?: Date,
    reportTime?: Date,
  ) => void;
}

export const SNNForm: React.FC<Props> = observer((props) => {
  const userStore = useContext(UserStoreContext);
  const locationsStore = useContext(LocationsStoreContext);

  const initialSnn: Partial<ISNN> = props.editMode
    ? props.snn!
    : {
        user: userStore.user,
        boatName: '',
        boatClass: '',
        positionNeeded: '',
        reportTime: new Date(0),
        location: userStore.user?.hometown || '',
        type: 'racing',
        site: '',
        notes: '',
        acceptedCrew: [],
        eliminatedCrew: [],
        declinedCrew: [],
      };

  const initialReportTime = props.editMode
    ? new Date(props.snn!.reportTime)
    : undefined;
  const initialReportDate = props.editMode
    ? new Date(props.snn!.reportTime)
    : undefined;

  const [snn, setSnn] = useState<Partial<ISNN>>(initialSnn);
  const [reportDate, setReportDate] = useState(initialReportDate);
  const [reportTime, setReportTime] = useState(initialReportTime);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [showLocationWarning, setShowLocationWarning] = useState(false);

  useEffect(() => {
    if (userStore.shouldFetch) {
      userStore.getCurrentUser();
    }
  }, []);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const onLocationChange = (value: string) => {
    setSnn({
      ...snn,
      location: value,
    });
    setShowLocationWarning(userStore.user?.hometown !== value);
  };

  const onPressButton = () => {
    props.onSubmit(snn, showLocationWarning, reportDate, reportTime);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.containerContent}>
      <Text style={styles.infoText}>
        Fill out the following form to send a notification to all crews in{' '}
        {snn.location || 'the area'}
      </Text>
      {userStore.isLoading && <ActivityIndicator style={styles.loading} />}
      <TextInput
        style={styles.nameText}
        value={snn.boatName}
        label="Boat Name"
        placeholder="Serenity"
        mode="flat"
        onChangeText={(v) =>
          setSnn({
            ...snn,
            boatName: v,
          })
        }
      />
      <TextInput
        style={styles.nameText}
        value={snn.boatClass}
        label="Boat Class"
        placeholder="420s"
        mode="flat"
        onChangeText={(v) =>
          setSnn({
            ...snn,
            boatClass: v,
          })
        }
      />
      <TextInput
        style={styles.nameText}
        value={snn.positionNeeded}
        label="Position Needed"
        placeholder="Driver"
        mode="flat"
        onChangeText={(v) =>
          setSnn({
            ...snn,
            positionNeeded: v,
          })
        }
      />
      <TouchableWithoutFeedback
        style={{ ...styles.nameText }}
        onPress={() => showDatePicker()}>
        <View style={{ width: '100%' }}>
          <View pointerEvents="none" style={{ width: '100%' }}>
            <TextInput
              value={!!reportDate ? dateToString(reportDate) : ''}
              placeholder="Report Date"
              style={styles.nameText}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        headerTextIOS="Pick a Date"
        onConfirm={(date: Date) => {
          setReportDate(date);
          setDatePickerVisible(false);
        }}
        onCancel={() => hideDatePicker()}
      />
      <TouchableWithoutFeedback
        style={styles.nameText}
        onPress={() => showTimePicker()}>
        <View style={{ width: '100%' }}>
          <View pointerEvents="none" style={{ width: '100%' }}>
            <TextInput
              value={!!reportTime ? timeToString(reportTime) : ''}
              placeholder="Report Time"
              style={styles.nameText}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <DateTimePickerModal
        isVisible={timePickerVisible}
        mode="time"
        headerTextIOS="Pick a Time"
        onConfirm={(time: Date) => {
          setReportTime(time);
          setTimePickerVisible(false);
        }}
        onCancel={() => hideTimePicker()}
      />
      <Dropdown
        containerStyle={styles.dropdown}
        fontSize={28}
        label="Location"
        data={[
          { value: 'None' },
          ...(locationsStore.locations?.map((l) => ({
            value: l,
          })) || []),
        ]}
        value={snn.location || ''}
        onChangeText={(text: string) => onLocationChange(text)}
      />
      <View style={styles.space} />
      <TextInput
        style={styles.nameText}
        value={snn.site}
        label="Site"
        placeholder="Regal Boat Club"
        mode="flat"
        onChangeText={(v) =>
          setSnn({
            ...snn,
            site: v,
          })
        }
      />
      <Dropdown
        containerStyle={styles.dropdown}
        fontSize={28}
        label="Type"
        data={sailingTypes}
        value={snn.type}
        onChangeText={(v: any) =>
          setSnn({
            ...snn,
            type: v,
          })
        }
      />
      <View style={styles.space} />
      <TextInput
        style={{ ...styles.nameText, height: 120, fontSize: 24 }}
        value={snn.notes}
        label="Notes"
        placeholder="Call me to confirm!"
        mode="flat"
        multiline
        onChangeText={(v) =>
          setSnn({
            ...snn,
            notes: v,
          })
        }
      />
      {showLocationWarning && (
        <View style={styles.locationWarningContainer}>
          <Text style={styles.locationWarningText}>
            You have set the location of this Crew Alert to some other location
            than the hometown in your profile. Creating this Crew Alert will
            cause the hometown in your profile to update to {snn.location}.
          </Text>
        </View>
      )}
      <Button
        style={styles.saveButton}
        mode="contained"
        onPress={() => onPressButton()}>
        {props.editMode ? 'Update Crew Alert' : 'Send Notification'}
      </Button>
      {!!userStore.error && (
        <Text style={styles.errorText}>{userStore.error}</Text>
      )}
    </KeyboardAwareScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 18,
    marginHorizontal: 12,
  },
  loading: {
    marginTop: 18,
  },
  nameText: {
    fontSize: 28,
    marginTop: 18,
    height: 60,
    width: '90%',
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  saveButton: {
    marginTop: 16,
    width: '75%',
    marginBottom: 40,
  },
  errorText: {
    marginTop: 18,
    color: 'red',
  },
  dropdown: {
    marginTop: 18,
    height: 60,
    width: '88%',
  },
  space: {
    height: 1,
    backgroundColor: Colors.white,
    marginTop: 12,
  },
  locationWarningContainer: {
    margin: 8,
    marginTop: 12,
    backgroundColor: Colors.yellow200,
    padding: 6,
    borderRadius: 6,
  },
  locationWarningText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
