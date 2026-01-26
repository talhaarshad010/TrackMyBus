import React, { useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import OTPBox from './OTPBox';

export default function OTPInput({ length = 6, onComplete }) {
    const [values, setValues] = useState(Array(length).fill(''));
    const inputs = useRef([]);
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 6, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
        ]).start();
    };

    const handleChange = (text, index) => {
        const newValues = [...values];
        newValues[index] = text;
        setValues(newValues);

        if (text && index < length - 1) {
            inputs.current[index + 1].focus();
        }

        const code = newValues.join('');
        if (code.length === length) {
            onComplete(code, shake);
        }
    };

    const handleKey = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !values[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <Animated.View
            style={[
                styles.row,
                { transform: [{ translateX: shakeAnim }] },
            ]}
        >
            {values.map((val, i) => (
                <OTPBox
                    key={i}
                    ref={r => (inputs.current[i] = r)}
                    value={val}
                    onChangeText={t => handleChange(t, i)}
                    onKeyPress={e => handleKey(e, i)}
                />
            ))}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 30,
    },
});
