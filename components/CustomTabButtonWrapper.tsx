import type { Ionicons } from '@expo/vector-icons';
import type { BottomTabDescriptor, BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import type { NavigationHelpers, NavigationRoute, ParamListBase } from '@react-navigation/native';
import * as React from 'react';
import { Text } from 'react-native';

import { CustomTabButton } from '@/components/CustomTabButton';

import { styles } from '@/constants/Styles';

// Helper component to render each tab button consistently
export function CustomTabButtonWrapper({
    route,
    descriptor,
    navigation,
    isFocused,
    iconName,
}: {
    route: NavigationRoute<ParamListBase, string> | undefined;
    descriptor: BottomTabDescriptor | undefined;
    navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
    isFocused: boolean;
    iconName: keyof typeof Ionicons.glyphMap;
}) {
    if (!route || !descriptor) return null; // Handle cases where route/descriptor might be missing

    const { options } = descriptor;
    const label = options.tabBarLabel ?? options.title ?? route.name;

    const onPress = () => {
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
        }
    };

    const onLongPress = () => {
        navigation.emit({
            type: 'tabLongPress',
            target: route.key,
        });
    };

    return (
        <CustomTabButton
            key={route.key}
            icon={iconName}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            style={styles.tabButton} // Added style for flex distribution
        >
            {/* Ensure label is wrapped in Text */}
            <Text>{label as string}</Text>
        </CustomTabButton>
    );
}
