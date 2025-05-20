import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { State, type PlaybackState } from 'react-native-track-player';

import { rescheduleTrack } from '@/lib/track';

interface PlayButtonProps {
    onPress: () => Promise<void> | void;
    playbackState: PlaybackState;
}

export function PlayButton(props: PlayButtonProps) {
    let icon = <ActivityIndicator size="small" color="#342f56" />;
    let enabled = false;

    switch (props.playbackState.state) {
        case State.Playing:
            icon = <Ionicons name="stop" size={24} color="#342f56" />;
            enabled = true;
            break;

        case State.Stopped:
        case State.Ended:
        case State.Paused:
        case State.Ready:
            icon = <Ionicons name="play" size={24} color="#342f56" />;
            enabled = true;
            break;

        case State.None:
        case State.Error:
            // uh oh, stinky!
            void rescheduleTrack();
            break;

        case State.Buffering:
        case State.Loading:
        default:
            break;
    }

    return (
        <TouchableOpacity
            style={styles.mainButton}
            disabled={!enabled}
            onPress={() => {
                void props.onPress();
            }}
        >
            <View>{icon}</View>
        </TouchableOpacity>
    );
}

const scale = 100;

const styles = StyleSheet.create({
    mainButton: {
        width: scale,
        height: scale,
        borderRadius: scale / 2,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        position: 'absolute',
        bottom: 0,
        left: Math.ceil(Dimensions.get('window').width / 2) - scale / 2,
        borderColor: '#000',
        borderWidth: 1,
    },
});
