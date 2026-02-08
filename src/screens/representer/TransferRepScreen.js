import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransferRepScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);

  const currentUser = auth().currentUser;

  useEffect(() => {
    const ref = database().ref('users');

    ref.on('value', snap => {
      const arr = [];

      snap.forEach(child => {
        const data = child.val();

        // 🔥 only normal users (not reps)
        if (data.role === 'user') {
          arr.push({
            id: child.key,
            ...data,
          });
        }
      });

      setStudents(arr);
    });

    return () => ref.off();
  }, []);

  const transferRep = async () => {
    if (!selected) return;

    Alert.alert(
      'Transfer Representative',
      'Are you sure you want to make this student the new representative?',
      [
        { text: 'Cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: async () => {
            try {
              const updates = {};

              // old rep → user
              updates[`users/${currentUser.uid}/role`] = 'user';

              // new rep → representer
              updates[`users/${selected}/role`] = 'representer';

              await database().ref().update(updates);

              Alert.alert('Success ✅', 'Representative transferred');

              navigation.goBack();
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          },
        },
      ],
    );
  };

  if (students.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16 }}>No students available 😴</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select New Representative</Text>

      <FlatList
        data={students}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isSelected = selected === item.id;

          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.selected]}
              onPress={() => setSelected(item.id)}
            >
              <Text style={styles.name}>{item.email}</Text>

              {isSelected && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        }}
      />

      {selected && (
        <TouchableOpacity style={styles.btn} onPress={transferRep}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            Confirm Transfer
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// ==========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#f3f3f3',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  selected: {
    backgroundColor: '#000',
  },

  name: {
    color: '#000',
  },

  check: {
    color: '#fff',
    fontWeight: 'bold',
  },

  btn: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
