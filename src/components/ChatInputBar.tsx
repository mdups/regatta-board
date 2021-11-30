import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
//@ts-ignore
import AutogrowInput from 'react-native-autogrow-input';

interface Props {
  onChangeText: (text: string) => void;
  onSizeChange: () => void;
  onSendPressed: () => void;
  text: string;
}

//The bar at the bottom with a textbox and a send button.
export const ChatInputBar: React.FC<Props> = (props) => {
  let autogrowInput: any = undefined;

  //AutogrowInput doesn't change its size when the text is changed from the outside.
  //Thus, when text is reset to zero, we'll call it's reset function which will take it back to the original size.
  //Another possible solution here would be if InputBar kept the text as state and only reported it when the Send button
  //was pressed. Then, resetInputText() could be called when the Send button is pressed. However, this limits the ability
  //of the InputBar's text to be set from the outside.
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (props.text === '' && autogrowInput) {
      autogrowInput.resetInputText();
    }
  }, [props.text]);

  return (
    <View style={styles.inputBar}>
      <AutogrowInput
        style={styles.textBox}
        ref={(ref: any) => {
          autogrowInput = ref;
        }}
        multiline={true}
        defaultHeight={30}
        onChangeText={(text: string) => props.onChangeText(text)}
        onContentSizeChange={props.onSizeChange}
        value={props.text}
        placeholder="Type a message"
      />
      <TouchableHighlight
        style={styles.sendButton}
        onPress={() => props.onSendPressed()}>
        <Text style={{ color: 'white' }}>Send</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  textBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    marginLeft: 5,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: '#0277BD',
  },
});
