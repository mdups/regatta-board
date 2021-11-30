import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Badge } from "react-native-paper";

//@ts-ignore
export const withBadge = (value, options = {}) => WrappedComponent =>
  class extends React.Component {
    render() {
      //@ts-ignore
      const { top = -5, right = 0, left = 0, bottom = 0, hidden = !value || value === 0 } = options;
      const badgeValue = typeof value === "function" ? value(this.props) : value;
      return (
        //@ts-ignore
        <TouchableOpacity onPress={options.onPress}>
          <WrappedComponent {...this.props} />
          {!hidden && (
            <View style={[styles.badgeContainer, { top, right, left, bottom }]}>
              <Badge
                size={18}
                style={styles.badgeText}
                visible
              >
                {badgeValue}
              </Badge>
            </View>
          )}
        </TouchableOpacity>
      );
    }
  };

const styles = StyleSheet.create({
  badgeContainer: {
    position: "absolute"
  },
  badgeText: {
    fontSize: 10,
    paddingHorizontal: 0
  }
});
