import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AuthHeader({ title, subtitle }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 40 },
    title: { fontSize: 28, fontWeight: '700' },
    subtitle: { color: '#777', marginTop: 4 },
});
