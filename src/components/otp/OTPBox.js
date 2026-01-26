import React, { forwardRef } from 'react';
import { TextInput, StyleSheet } from 'react-native';

const OTPBox = forwardRef((props, ref) => {
    return (
        <TextInput
            ref={ref}
            style={styles.input}
            maxLength={1}
            keyboardType="number-pad"
            returnKeyType="next"
            {...props}
        />
    );
});

export default OTPBox;

const styles = StyleSheet.create({
    input: {
        width: 48,
        height: 56,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        backgroundColor: '#F9FAFB',
    },
});
