import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ONBOARDING_KEY } from './onboarding';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      setDone(val === 'true');
      setReady(true);
    });
  }, []);

  if (!ready) return null;
  return <Redirect href={done ? '/(tabs)/scanner' : '/onboarding'} />;
}
