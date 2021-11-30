/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import {
  TextInput,
  Button,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { AccountType, SailingType, SAILING_TYPES } from '../../models';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { humanizeAccountType, humanizeWord } from '../../utils/string_utils';
import { Checkbox } from 'react-native-paper';
import { Banner } from '../../components/Banner';
import { useFocusEffect } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { UserStoreContext, LocationsStoreContext } from '../../../App';

const accountTypes = [
  {
    value: 'crew',
    label: humanizeAccountType('crew'),
  },
  {
    value: 'boat',
    label: humanizeAccountType('boat'),
  },
];

const genderTypes = [
  {
    value: 'Male',
    label: 'Male',
  },
  {
    value: 'Female',
    label: 'Female',
  },
  {
    value: 'Other',
    label: 'Other',
  },
];

interface Props {
  navigation: StackNavigationProp<any, any>;
}

interface State {
  type?: AccountType;
  name: string;
  hometown: string;
  experience?: string;
  weight?: string;
  locations: string[];
  selectedSailingTypes?: SailingType[];
  age?: number;
  gender?: string;
  saved: boolean;
}

export const ProfileScreen: React.FC<Props> = observer((props) => {
  const [formState, setFormState] = useState<State>({
    type: undefined,
    name: '',
    hometown: '',
    locations: [],
    saved: true,
  });

  const userStore = useContext(UserStoreContext);
  const locationsStore = useContext(LocationsStoreContext);

  useFocusEffect(
    React.useCallback(() => {
      fillStateWithUserData();
    }, []),
  );

  useEffect(() => {
    if (userStore.shouldFetch) {
      userStore.getCurrentUser().then(() => {
        fillStateWithUserData();
      });
    } else {
      fillStateWithUserData();
    }

    if (locationsStore.shouldFetch) {
      locationsStore.fetchLocations();
    }
  }, []);

  const fillStateWithUserData = () => {
    const user = userStore.user;
    if (user) {
      setFormState({
        ...formState,
        type: user.type,
        name: user.name,
        hometown: user.hometown,
        experience: user.experience,
        weight: user.weight,
        selectedSailingTypes: user.sailingTypes || [],
        gender: user.gender,
        age: user.age,
      });
    }
  };

  const saveUser = async () => {
    await userStore.saveUser({
      name: formState.name,
      hometown: formState.hometown === 'None' ? '' : formState.hometown,
      experience: formState.experience,
      weight: formState.weight,
      type: formState.type!, // TODO: may cause crash if user presses this button before it loads
      sailingTypes: formState.selectedSailingTypes,
      age: formState.age,
      gender: formState.gender,
    });

    setFormState({
      ...formState,
      saved: true,
    });
  };

  const renderStatusText = () => {
    if (userStore.error) {
      return <Text style={styles.errorText}>{userStore.error}</Text>;
    }
    if (locationsStore.error) {
      return <Text style={styles.errorText}>{locationsStore.error}</Text>;
    }
    return formState.saved ? (
      <Text style={styles.upToDateText}>Profile Up To Date</Text>
    ) : (
      <View />
    );
  };

  const updateSelectedSailingTypes = (type: SailingType) => {
    const current = [...(formState.selectedSailingTypes || [])];
    if (current.includes(type)) {
      // remove
      current.splice(current.indexOf(type), 1);
    } else {
      // add
      current.push(type);
    }
    setFormState({
      ...formState,
      selectedSailingTypes: current,
      saved: false,
    });
  };

  const renderSailingType = (type: SailingType) => {
    const checked = formState.selectedSailingTypes?.includes(type) || false;
    return (
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => updateSelectedSailingTypes(type)}>
        <Text>{humanizeWord(type)}</Text>
        <Checkbox.Android
          status={checked ? 'checked' : 'unchecked'}
          color="blue"
        />
      </TouchableOpacity>
    );
  };

  const renderSailingTypesList = () => {
    return (
      <View style={styles.checkboxListContainer}>
        <Text style={styles.sailingTypesText}>Sailing Types</Text>
        {SAILING_TYPES.map((t) => renderSailingType(t))}
      </View>
    );
  };

  const {
    type,
    name,
    hometown,
    saved,
    experience,
    weight,
    age,
    gender,
  } = formState;

  return (
    <View style={styles.container}>
      {!formState.saved && (
        <Banner text="You have unsaved changes. Press the Save button below to save your changes." />
      )}
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {userStore.isLoading && <ActivityIndicator style={styles.loading} />}
        <Text style={styles.emailText}>{userStore.user?.email || ''}</Text>
        <Dropdown
          containerStyle={styles.accountTypeDropDown}
          fontSize={24}
          label="Account Type"
          data={accountTypes}
          value={type}
          onChangeText={(v: any) =>
            setFormState({
              ...formState,
              type: v,
              saved: false,
            })
          }
        />
        <View style={styles.space} />
        <TextInput
          style={styles.nameText}
          value={name}
          label="Full Name"
          placeholder="John Smith"
          mode="flat"
          onChangeText={(v: any) =>
            setFormState({
              ...formState,
              name: v,
              saved: false,
            })
          }
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
          value={hometown || ''}
          onChangeText={(v: any) =>
            setFormState({
              ...formState,
              hometown: v,
              saved: false,
            })
          }
        />
        <View style={styles.space} />
        <Dropdown
          containerStyle={styles.dropdown}
          fontSize={28}
          label="Gender"
          data={genderTypes}
          value={gender || ''}
          onChangeText={(v: any) =>
            setFormState({
              ...formState,
              gender: v,
              saved: false,
            })
          }
        />
        <View style={styles.space} />
        <TextInput
          style={{ ...styles.nameText }}
          value={age ? age.toString() : ''}
          label="Age (years)"
          placeholder="24"
          mode="flat"
          onChangeText={(v: any) =>
            setFormState({
              ...formState,
              age: Number(v),
              saved: false,
            })
          }
        />
        {type === 'crew' && (
          <TextInput
            style={{
              ...styles.nameText,
              height: 120,
              fontSize: 24,
              marginTop: 10,
            }}
            value={experience}
            label="Experience"
            placeholder="2 years of racing"
            mode="flat"
            multiline
            onChangeText={(v: any) =>
              setFormState({
                ...formState,
                experience: v,
                saved: false,
              })
            }
          />
        )}
        {type === 'crew' && (
          <TextInput
            style={{ ...styles.nameText }}
            value={weight}
            label="Weight (lbs.)"
            placeholder="180"
            mode="flat"
            onChangeText={(v: any) =>
              setFormState({
                ...formState,
                weight: v,
                saved: false,
              })
            }
          />
        )}
        {type === 'crew' && renderSailingTypesList()}
        <Button
          style={styles.saveButton}
          mode="contained"
          onPress={() => saveUser()}
          disabled={saved}>
          Save
        </Button>
        {renderStatusText()}
        <View style={styles.bottomSpace} />
      </KeyboardAwareScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  loading: {
    marginTop: 18,
  },
  emailText: {
    fontSize: 16,
    marginTop: 16,
  },
  nameText: {
    fontSize: 28,
    marginTop: 18,
    height: 60,
    width: '90%',
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  accountTypeDropDown: {
    marginTop: 18,
    height: 60,
    width: 150,
  },
  dropdown: {
    marginTop: 18,
    height: 60,
    width: '88%',
  },
  saveButton: {
    marginTop: 24,
  },
  upToDateText: {
    marginTop: 18,
    color: 'green',
  },
  errorText: {
    marginTop: 18,
    color: 'red',
  },
  space: {
    height: 1,
    backgroundColor: Colors.white,
    marginTop: 12,
  },
  checkboxListContainer: {
    marginTop: 12,
    flexDirection: 'column',
    flex: 1,
    width: '90%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sailingTypesText: {
    fontSize: 24,
    marginVertical: 4,
  },
  bottomSpace: {
    height: 48,
  },
});
