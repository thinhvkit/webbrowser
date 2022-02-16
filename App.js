/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {WebView} from 'react-native-webview';
import Utils from './Utils';
import styles from './styles';

const AddressBar = ({url, onLoad, onReload}) => {
  const [inputText, setInputText] = useState('');
  const textInputRef = useRef();

  const load = () => {
    if (inputText === url) {
      onReload();
    } else {
      onLoad(inputText);
    }
    // dismiss keyboard
    textInputRef.current.blur();
  };

  const handleTextInputChange = event => {
    const input = Utils.sanitizeUrl(event.nativeEvent.text);
    setInputText(input);
  };

  const onSubmitEditing = event => {
    load();
  };

  return (
    <View style={[styles.addressBarRow]}>
      <TextInput
        ref={textInputRef}
        autoCapitalize="none"
        defaultValue={url}
        onSubmitEditing={onSubmitEditing}
        onChange={handleTextInputChange}
        clearButtonMode="while-editing"
        style={[styles.addressBarTextInput]}
      />
    </View>
  );
};

const App = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [url, setUrl] = useState('http://google.com');
  const isDarkMode = useColorScheme() === 'dark';
  const webviewRef = useRef();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    webviewRef.current.reload();
    setTimeout(2000).then(() => setRefreshing(false));
  }, []);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const reload = () => {
    webviewRef.current.reload();
  };

  const load = param => {
    setUrl(param);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.header}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AddressBar onReload={reload} onLoad={load} url={''} />
      </View>

      <ScrollView
        style={styles.scrollStyle}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={reload} // exl in function : this.yourWebview.reload();
          />
        }>
        <WebView
          ref={webviewRef}
          automaticallyAdjustContentInsets={false}
          style={styles.webView}
          source={{uri: url}}
          javaScriptEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
