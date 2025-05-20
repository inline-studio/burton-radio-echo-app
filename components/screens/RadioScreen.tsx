import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function RadioScreen() {
    const [canGoBack, setCanGoBack] = useState(false);
    const webViewRef = useRef<WebView>(null);
    const onAndroidBackPress = useCallback(() => {
        if (canGoBack) {
            webViewRef.current?.goBack();
            return true; // prevent default behavior (exit app)
        }
        return false;
    }, [canGoBack]);

    useEffect(() => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
            };
        }
    }, [onAndroidBackPress]);

    return (
        <WebView
            ref={webViewRef}
            source={{ uri: 'https://www.burtonradio.co.uk/' }}
            decelerationRate={'normal'}
            allowsBackForwardNavigationGestures={true}
            onLoadProgress={(event) => {
                setCanGoBack(event.nativeEvent.canGoBack);
            }}
        />
    );
}
