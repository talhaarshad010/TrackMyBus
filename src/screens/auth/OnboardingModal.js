import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import database from '@react-native-firebase/database';

export default function OnboardingModal({ user, onComplete }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(null);
  const [semester, setSemester] = useState(null);

  const departments = [
    { label: 'BSCS', value: 'BSCS' },
    { label: 'BBA', value: 'BBA' },
  ];

  const semesters = Array.from({ length: 8 }, (_, i) => ({
    label: `${i + 1}th Semester`,
    value: `${i + 1}`,
  }));

  const handleSave = async () => {
    if (!name || !phone || !department || !semester) return;

    await database().ref(`users/${user.uid}`).update({
      name,
      phone,
      department,
      semester,
      profileComplete: true,
    });

    onComplete();
  };

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Complete Your Profile</Text>

          <Input placeholder="Full Name" value={name} onChangeText={setName} />
          <Input placeholder="Phone" value={phone} onChangeText={setPhone} />

          {/* Department Dropdown */}
          <Dropdown
            style={styles.dropdown}
            data={departments}
            labelField="label"
            valueField="value"
            placeholder="Select Department"
            value={department}
            onChange={item => setDepartment(item.value)}
          />

          {/* Semester Dropdown */}
          <Dropdown
            style={styles.dropdown}
            data={semesters}
            labelField="label"
            valueField="value"
            placeholder="Select Semester"
            value={semester}
            onChange={item => setSemester(item.value)}
          />

          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const Input = props => <TextInput style={styles.input} {...props} />;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F3F3F3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
