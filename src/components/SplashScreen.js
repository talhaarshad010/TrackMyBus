import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const NAME = 'TrackMyBus';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  const letters = NAME.split('');

  const animations = useRef(
    letters.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    })),
  ).current;

  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const sequence = animations.map(anim =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.stagger(70, sequence).start(() => {
      // wait little then fade whole screen
      setTimeout(() => {
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, 600);
    });
  }, []);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <View style={styles.row}>
        {letters.map((l, i) => (
          <Animated.Text
            key={i}
            style={[
              styles.text,
              {
                opacity: animations[i].opacity,
                transform: [{ translateY: animations[i].translateY }],
              },
            ]}
          >
            {l}
          </Animated.Text>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
  },
});
