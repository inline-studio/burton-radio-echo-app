import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PlaybackState } from 'react-native-track-player';

import { CustomTabButtonWrapper } from '@/components/CustomTabButtonWrapper';
import { PlayButton } from '@/components/PlayButton';
import { SettingsButton } from '@/components/SettingsButton';

import { styles } from '@/constants/Styles';

export function CustomTabBar({
    state,
    descriptors,
    navigation,
    playbackState,
    togglePlayback,
    openSettings,
}: BottomTabBarProps & {
    playbackState: PlaybackState;
    togglePlayback: () => Promise<void> | void;
    openSettings: () => void;
}) {
    // Define icons for each route name
    const routeIcons = {
        Radio: 'radio',
        Echo: 'newspaper',
        Settings: 'options', // Or 'cog', 'options', etc. depending on your icon set
    } as const;

    return (
        <SafeAreaView style={styles.tabBarContainer}>
            <View style={styles.tabBarInnerContainer}>
                {/* Render Radio Tab */}
                <CustomTabButtonWrapper
                    route={state.routes.find((r) => r.name === 'Radio')}
                    descriptor={descriptors[state.routes.find((r) => r.name === 'Radio')?.key ?? '']}
                    navigation={navigation}
                    isFocused={state.index === state.routes.findIndex((r) => r.name === 'Radio')}
                    iconName={routeIcons.Radio}
                />

                {/* Render Play Button */}
                <PlayButton onPress={togglePlayback} playbackState={playbackState} />

                {/* Render Settings Button */}
                <SettingsButton onPress={openSettings} />

                {/* Render Echo Tab */}
                <CustomTabButtonWrapper
                    route={state.routes.find((r) => r.name === 'Echo')}
                    descriptor={descriptors[state.routes.find((r) => r.name === 'Echo')?.key ?? '']}
                    navigation={navigation}
                    isFocused={state.index === state.routes.findIndex((r) => r.name === 'Echo')}
                    iconName={routeIcons.Echo}
                />
            </View>
        </SafeAreaView>
    );
}
