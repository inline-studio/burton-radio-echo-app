// /Users/scott/Herd/Dev/inLineStudio/apps/BurtonRadioEcho/app/settings.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { type NotificationPreferences, setupNotificationsForShows } from '@/lib/notificationManager';
import { SHOW_SCHEDULE } from '@/lib/showSchedule';
import { Logger } from '@/services';

// --- Configuration ---
const ASYNC_STORAGE_KEY = 'notificationPreferences';
const DEBOUNCE_DELAY = 2500;

// Manually derived list of unique show names from the schedule URL
// Ideally, fetch this from an API you control for easier updates.
const SHOW_NAMES = Object.keys(SHOW_SCHEDULE) as (keyof typeof SHOW_SCHEDULE)[];

export default function SettingsScreen() {
    const [preferences, setPreferences] = useState<NotificationPreferences>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Load Preferences ---
    useEffect(() => {
        const loadPreferences = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const storedPreferences = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
                if (storedPreferences !== null) {
                    setPreferences(JSON.parse(storedPreferences) as NotificationPreferences);
                } else {
                    // Initialize with all off if nothing is stored
                    const initialPrefs: NotificationPreferences = {};
                    SHOW_NAMES.forEach((name) => {
                        initialPrefs[name] = false;
                    });
                    setPreferences(initialPrefs);
                }
            } catch (e) {
                Logger.error('Failed to load notification preferences:', e);
                setError('Failed to load settings. Please try again.');
                // Initialize with default state on error
                const initialPrefs: NotificationPreferences = {};
                SHOW_NAMES.forEach((name) => {
                    initialPrefs[name] = false;
                });
                setPreferences(initialPrefs);
            } finally {
                setIsLoading(false);
            }
        };

        loadPreferences().catch((err: unknown) => {
            Logger.error('loadPreferences', err);
        });
    }, []); // Empty dependency array means run once on mount

    // --- Debounced Save Preferences ---
    // Use useMemo to create the debounced function only once
    const debouncedSavePreferences = useMemo(
        () =>
            debounce(async (newPrefs: NotificationPreferences) => {
                try {
                    //   Logger.debug("Saving notification preferences (debounced):", newPrefs);
                    await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(newPrefs));
                    await setupNotificationsForShows();
                } catch (e) {
                    Logger.error('Failed to save notification preferences:', e);
                    // Optionally show an error to the user
                }
            }, DEBOUNCE_DELAY), // Apply the debounce delay
        [] // Empty dependency array ensures the debounced function is stable
    );

    // // --- Save Preferences ---
    // const savePreferences = useCallback(
    //   async (newPrefs: NotificationPreferences) => {
    //     try {
    //       Logger.debug("Saving notification preferences:", newPrefs);
    //       await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(newPrefs));
    //       // TODO: fire notification setup here
    //     } catch (e) {
    //       Logger.error("Failed to save notification preferences:", e);
    //       // Optionally show an error to the user
    //     }
    //   },
    //   []
    // );

    // --- Handle Toggle ---
    const handleToggle = (showName: string, value: boolean) => {
        const newPreferences = {
            ...preferences,
            [showName]: value,
        };
        setPreferences(newPreferences);
        void debouncedSavePreferences(newPreferences);
    };
    // const handleToggle = (showName: string, value: boolean) => {
    //   const newPreferences = {
    //     ...preferences,
    //     [showName]: value,
    //   };
    //   setPreferences(newPreferences);
    //   savePreferences(newPreferences); // Save whenever a toggle changes
    // };

    // --- Render Logic ---
    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading Settings...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Notifications Settings</Text>
            <Text style={styles.subHeader}>Select which shows you'd like to receive notifications for.</Text>

            {SHOW_NAMES.map((showName) => (
                <View key={showName} style={styles.row}>
                    <Text style={styles.label}>{showName}</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={preferences[showName] ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={(value) => {
                            handleToggle(showName, value);
                        }}
                        value={preferences[showName] ?? false} // Default to false if undefined
                    />
                </View>
            ))}
            {/* Add a little space at the bottom */}
            <View style={{ height: 70 }} />
        </ScrollView>
    );
}

// --- Styles ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#342f56',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
        marginTop: 50,
    },
    subHeader: {
        marginTop: 25,
        fontSize: 16,
        color: '#fff',
        marginBottom: 25,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        fontSize: 16,
        flex: 1, // Allow label to take up space
        marginRight: 10, // Add space between label and switch
        color: '#fff',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#fff', // Make loading text visible on dark background
    },
});
