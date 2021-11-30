import * as React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { apiEnvironment } from '../../utils/config_utils';

export const AboutScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.aboutText}>
        RegattaBoard is an app designed by sailors for sailors. By utilizing our
        Short Notice Notifications system (SNN), boat owners and crews can be
        connected quickly, eliminating the stress and frustrations of finding
        crew in a pinch.
      </Text>
      <Text style={styles.howItWorksText}>How it works:</Text>
      <Text style={styles.titleText}>Boat Owners:</Text>
      <Text style={styles.sectionText}>
        If you own a boat and are looking for crews, change your account type to
        Boat Owner. In the boat owner page, fill out your profile information
        and you will be all set to send out SNNs. When you need a crew, hit the
        button in the bottom right of the screen and fill out the SNN form. Once
        the form is complete, a notification will be sent out to all crews. When
        crews start accepting your SNN, you can review potential crew, decline
        ones you do not feel are fit, and select the best candidate. Once you
        make your selection, that crew will be notified and from here contact
        information can be exchanged.
      </Text>
      <Text style={styles.titleText}>Crews:</Text>
      <Text style={styles.sectionText}>
        If you are a crew who wants to go sailing, change your account type to
        Crew. Once you fill out your profile information you are all set to
        start accepting SNNs. When a Boat Owner needs crew you will receive an
        SNN, you can either accept or decline that offer. ACCEPTING AN SNN DOES
        NOT MEAN YOU ARE CHOSEN AS THE CREW. All accepted SNN are sent to the
        boat owner. If you are selected to sail, you will receive another
        notification from the boat owner. From here contact information can be
        exchanged.
      </Text>
      <Text style={styles.titleText}>Locations:</Text>
      <Text style={styles.sectionText}>
        To select or change locations, go to your profile. In your profile use
        the drop down menu to select which location you would like to use. Be
        sure to save your profile after selecting a location. Now you will only
        send/receive SNNs in that desired location. If you have a request for a
        new location to be added, send us a message at contact@regattaboard.com.
      </Text>
      <Text style={styles.versionText}>
        Version {DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()}){'\n'}
        {apiEnvironment()}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
  },
  aboutText: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 17,
    marginBottom: 24,
  },
  howItWorksText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionText: {
    textAlign: 'center',
    fontSize: 17,
    marginBottom: 16,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 48,
  },
});
