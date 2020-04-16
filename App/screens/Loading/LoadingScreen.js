import styles from './styles';
import React, { Component } from 'react';
import { Text, View } from 'react-native';

class LoadingScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Essa é a tela de carregamento</Text>
            </View>
        );
    }
}

export default LoadingScreen;
