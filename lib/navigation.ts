import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { StaticParamList } from '@react-navigation/native';

import EchoScreen from '@/components/screens/EchoScreen';
import RadioScreen from '@/components/screens/RadioScreen';
import SettingsScreen from '@/components/screens/SettingsScreen';

export const Tabs = createBottomTabNavigator({
    screens: {
        Echo: EchoScreen,
        Radio: RadioScreen,
        Settings: SettingsScreen,
    },
});

type RootStackParamList = StaticParamList<typeof Tabs>;

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace ReactNavigation {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface RootParamList extends RootStackParamList { }
    }
}