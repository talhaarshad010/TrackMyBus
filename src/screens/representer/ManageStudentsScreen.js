import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import database from '@react-native-firebase/database';

export default function ManageStudentsScreen() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const ref = database().ref('users');

    ref.on('value', snap => {
      const list = [];

      snap.forEach(child => {
        const data = child.val();

        if (data.role === 'user') {
          list.push({ id: child.key, ...data });
        }
      });

      setStudents(list);
      setLoading(false);
    });

    return () => ref.off();
  }, []);

  const makeRep = uid => {
    database().ref(`users/${uid}`).update({
      role: 'representer',
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (students.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>👤</Text>
        <Text style={styles.emptyTitle}>No Students Yet</Text>
        <Text style={styles.emptySub}>
          Students will appear here after signup
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View>
        <Text style={styles.name}>{item.name || 'No Name'}</Text>
        <Text style={styles.sub}>{item.email}</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => makeRep(item.uid)}>
        <Text style={{ color: '#fff' }}>Make Rep</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={students}
      keyExtractor={i => i.uid}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontWeight: 'bold',
  },

  sub: {
    opacity: 0.6,
    fontSize: 12,
  },

  btn: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 50,
    opacity: 0.4,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },

  emptySub: {
    opacity: 0.5,
    marginTop: 4,
  },
});
