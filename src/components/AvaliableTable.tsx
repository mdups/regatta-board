import React, {useContext} from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import {
    IconButton
} from 'react-native-paper'
import { observer } from 'mobx-react-lite';
import {
  ChatStoreContext,
  UserStoreContext,
  CrewSNNSStoreContext
} from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import {CrewSNNSStore} from '../stores/crew_snns_store';

//Testing version of state that's going to have the peoples names
//TODO: set example const to the state, create that state from crew homescreen toggle tags
const exampleNamesArr = [{
  name:'Miles Dupee'
},{
  name:'Cam Conour'
},{
  name: 'Aldrigeuqz de la Leed'
}]
interface Props {
  navigation: StackNavigationProp<any, any>;
}
const AvaliableTable: React.FC<Props> = observer((props) => {
  const crewSNNSStore = useContext(CrewSNNSStoreContext);
  const chatStore = useContext(ChatStoreContext);
  const userStore = useContext(UserStoreContext);
  const [popupOpen, setPopupOpen] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState({
    name: 'Example',
    id: 190
  })
  
  const onInfoClick = () => {
    setPopupOpen(!popupOpen)
    let loc = crewSNNSStore.fetchAllSNNS()
    
    console.log('loc: ' + {loc})
    //console.log(crewSNNSStore.snnsAtLocation(loc))
  }

  let rows = exampleNamesArr.map((person) => {
    return(
    <View style={styles.row}> 
      <ScrollView horizontal={true} style={{flexDirection:'row', flex:2.5}}>
        <Text style={styles.text}> {person.name} </Text>
      </ScrollView>
      <View style={{flex:.5, justifyContent:'center'}}>
        <IconButton icon="message-text-outline" 
          size={30} 
          color={'#ffff'}
          style={styles.messageIcon}
          onPress={() => {
            //TODO: change the '190' to person.id when you figure out how the state works a bit better
            chatStore.findOrCreateConversation('190').then(() => {
              props.navigation.navigate('Chat');
            });
          }}>
        </IconButton>
        <IconButton
            icon="information-outline"
            size={30}
            color={'#ffff'}
            style={styles.infoIcon}
            onPress={()=> onInfoClick()}> </IconButton>
      </View>
    </View>
  )});

  let PopupInfo = () => {
    return(
        (popupOpen) ? (
        <View style={{backgroundColor:'grey', width:250, height:100, position:'absolute',alignItems:'center', zIndex: 999}}>
            <Text style={{alignItems:'flex-start'}}>
              {currentUser.name} {currentUser.id}
            </Text>
            <Button color={'blue'} title={'close'}
            onPress={() => onInfoClick()}/>
        </View>
        ) : null
    )
}

  return (
    <View>
        <Text style={{fontSize:20,textAlign:'center', margin: 18}}>
            Currently avaliable crew members in your area:
        </Text>
        <ScrollView bounces={true} style={styles.table}>
          <View style={{alignItems:'center', zIndex: 999}}>
            <PopupInfo/>
          </View>
          {rows}
        </ScrollView>
    </View>
    
  );
});

const styles = StyleSheet.create({
  table: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    backgroundColor: '#ffff'
  },
  row: {
    backgroundColor: 'rgb(3,119,189)',
    padding: 6,
    flex: 1,  
    borderWidth: 5,
    borderColor: '#ffff',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  text: {
    fontSize: 23,
    textAlign: 'center',
    color: '#ffff'
  },
  infoIcon: {
    flex:1,
    position:'absolute',
    right:0
    },
  messageIcon: {
    flex:1,
    position:'absolute',
    right:45
  }
});

export default AvaliableTable