import React, { useContext } from 'react';
import { SNNForm } from './SNNForm';
import { ISNN } from '../../models';
import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import { BoatSNNSStoreContext, UserStoreContext } from '../../../App';

interface Props {
  navigation: StackNavigationProp<any, any>;
}

export const CreateSNNScreen: React.FC<Props> = observer((props) => {
  const userStore = useContext(UserStoreContext);
  const boatSNNSStore = useContext(BoatSNNSStoreContext);

  const createSNN = (
    snn: Partial<ISNN>,
    showLocationWarning: boolean,
    reportDate?: Date,
    reportTime?: Date,
  ) => {
    boatSNNSStore.createSNN(snn, reportDate, reportTime).then(() => {
      if (!boatSNNSStore.error) {
        if (showLocationWarning) {
          userStore.updateUserHometown(snn.location);
        }
        props.navigation.goBack();
      }
    });
  };

  return (
    <SNNForm
      navigation={props.navigation}
      editMode={false}
      onSubmit={(
        snn: Partial<ISNN>,
        showLocationWarning: boolean,
        reportDate?: Date,
        reportTime?: Date,
      ) => createSNN(snn, showLocationWarning, reportDate, reportTime)}
    />
  );
});
