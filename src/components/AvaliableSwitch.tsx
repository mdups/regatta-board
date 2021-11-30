import * as React from 'react';
import {getCurrentUser} from '../api/user'
import { View, Text, StyleSheet, Switch } from 'react-native';

const AvaliableSwitch = () => {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const onToggleSwitch = () => {
        setIsSwitchOn(!isSwitchOn)
    }
    
    return(
        <View> 
            <View style={{flexDirection:'row'}}>
                <Text style={styles.text}>
                    Mark your avalibility!
                </Text> 
                <Switch 
                style={{marginLeft: 15}}
                value={isSwitchOn}
                onValueChange={onToggleSwitch}/>
            </View>
            <Text>
                Your selection will reset after 12 hours. 
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
    text: {
        fontSize: 20
    }
});
export default AvaliableSwitch