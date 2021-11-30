import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserAvatar } from './UserAvatar';
import { dateToRelativeText } from '../utils/datetime_utils';

export interface ConversationRowProps {
  id: string;
  name: string;
  mostRecentMessage: string;
  date?: Date;
  onPress: (id: string) => void;
}

export const ConversationRow: React.FC<ConversationRowProps> = (props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => props.onPress(props.id)}>
      <UserAvatar name={props.name} />
      <View style={styles.textWrapper}>
        <View style={styles.firstRowTextWrapper}>
          <Text style={styles.titleText}>{props.name}</Text>
          <Text style={styles.dateText}>
            {props.date ? dateToRelativeText(props.date) : ''}
          </Text>
        </View>
        <Text style={styles.subtitleText}>{props.mostRecentMessage}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
  },
  textWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 12,
    flex: 1,
  },
  titleText: {
    fontSize: 16,
  },
  subtitleText: {
    fontSize: 14,
  },
  firstRowTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    textAlign: 'right',
  },
});
