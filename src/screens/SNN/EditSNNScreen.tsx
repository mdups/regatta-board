import React, { useContext } from 'react';
import { ISNN } from '../../models';
import { SNNForm } from './SNNForm';
import { observer } from 'mobx-react-lite';
import { BoatSNNSStoreContext, UserStoreContext } from '../../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

interface Props {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
  snn?: ISNN;
}

export const EditSNNScreen: React.FC<Props> = observer((props) => {
  const userStore = useContext(UserStoreContext);
  const boatSNNSStore = useContext(BoatSNNSStoreContext);

  if (!props.route.params?.snn) {
    throw new Error('Snn was not provided for edit screen');
  }

  const updateSNN = (
    snn: Partial<ISNN>,
    showLocationWarning: boolean,
    reportDate?: Date,
    reportTime?: Date,
  ) => {
    boatSNNSStore
      .updateSNN(snn, reportDate, reportTime, userStore.user?.hometown)
      .then(() => {
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
      editMode
      onSubmit={(
        snn: Partial<ISNN>,
        showLocationWarning: boolean,
        reportDate?: Date,
        reportTime?: Date,
      ) => updateSNN(snn, showLocationWarning, reportDate, reportTime)}
      snn={props.route.params?.snn}
    />
  );
});
