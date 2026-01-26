// import React from 'react';
// import {
//     SafeAreaView,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     StyleSheet,
// } from 'react-native';

// export default function AuthLayout({ children }) {
//     return (
//         <SafeAreaView style={styles.safe}>
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//                 style={{ flex: 1 }}
//             >
//                 <ScrollView
//                     contentContainerStyle={styles.container}
//                     keyboardShouldPersistTaps="handled"
//                 >
//                     {children}
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     safe: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     container: {
//         flexGrow: 1,
//         padding: 24,
//         justifyContent: 'center',
//     },
// });import React from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';

export default function AuthLayout({ children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.center}
      >
        {/* 🔥 CARD */}
        <View style={styles.card}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 28,

    // 🔥 premium shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
});
