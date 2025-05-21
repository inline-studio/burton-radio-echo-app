import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    type TrackMetadataBase,
    type Track,
} from 'react-native-track-player';

import { Logger } from '@/services';
import icon from '@/assets/images/icon.png';

let trackIdx = -1;
let playerInitialized = false;

export let track: Track = {
    id: 1,
    url: 'https://s9.citrus3.com:8370/stream',
    title: 'Burton Radio Live',
    artist: 'Burton Radio',
    artwork: icon,
    isLiveStream: true,
};

export async function ingestMetadata(data: TrackMetadataBase) {
    if (trackIdx >= 0) {
        Logger.debug('incoming metadata', data);
        data = { ...data, artwork: icon }; // fix weird overwrite issue
        track = { ...track, data }; // insert so that reloading will restore it
        await TrackPlayer.updateMetadataForTrack(trackIdx, data);
    }
}

export async function rescheduleTrack() {
    await TrackPlayer.stop();
    await TrackPlayer.removeUpcomingTracks();
    trackIdx = (await TrackPlayer.add(track) as number | undefined) ?? 0;
}

export async function shutdownPlayer() {
    Logger.debug('shutting down track player');
    await TrackPlayer.stop();
    await TrackPlayer.removeUpcomingTracks();
    trackIdx = -1;
}

export async function setupPlayer() {
    // ... (Keep your existing setupPlayer function)
    Logger.debug('player state', playerInitialized);
    //   if (State.) {

    //   }
    if (playerInitialized) {
        Logger.warn('Player already initialized.');
        return;
    }
    try {
        Logger.debug('Setting up Track Player...');
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
            capabilities: [Capability.Play, Capability.Stop],
            compactCapabilities: [Capability.Play, Capability.Stop],
            android: {
                appKilledPlaybackBehavior: AppKilledPlaybackBehavior.PausePlayback,
            },
        });
        await rescheduleTrack();
        playerInitialized = true;
        Logger.debug('Track Player setup complete and track added.');
    } catch (e: unknown) {
        Logger.error('Error setting up Track Player:', e);
        trackIdx = -1;
        playerInitialized = false;
    }
}