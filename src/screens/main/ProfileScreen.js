import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);

  const [editVisible, setEditVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const [form, setForm] = useState({});

  // =========================
  // 🔥 REALTIME FIREBASE DATA
  // =========================
  useEffect(() => {
    const uid = auth().currentUser.uid;

    const ref = database().ref(`users/${uid}`);

    const listener = ref.on('value', snap => {
      const data = snap.val();
      setUserData(data);
      setForm(data);
    });

    return () => ref.off('value', listener);
  }, []);

  // =========================
  // Logout
  // =========================
  const handleLogout = async () => {
    setLogoutVisible(false);
    await auth().signOut();
  };

  // =========================
  // Save Edit
  // =========================
  const handleSave = async () => {
    const uid = auth().currentUser.uid;

    await database().ref(`users/${uid}`).update({
      name: form.name,
      phone: form.phone,
      department: form.department,
      semester: form.semester,
    });

    setEditVisible(false);
  };

  if (!userData) return null;

  // role mapping
  const roleLabel = userData.role === 'user' ? 'Student' : 'Representer';

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ===== HEADER (SAME UI) ===== */}
        <View style={styles.profileCard}>
          {/* <Image
            source={{ uri: 'https://i.pravatar.cc/150' }}
            style={styles.avatar}
          /> */}

          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>

        {/* ===== INFO SECTION ===== */}
        <View style={styles.section}>
          <Item label="Phone" value={userData.phone} />
          <Item label="Department" value={userData.department} />
          <Item label="Semester" value={`${userData.semester}`} />
          <Item label="Role" value={roleLabel} />
        </View>

        {/* ===== BUTTONS ===== */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditVisible(true)}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setLogoutVisible(true)}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ================================================= */}
      {/* 🔥 EDIT PROFILE MODAL */}
      {/* ================================================= */}

      <Modal visible={editVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Input
              placeholder="Name"
              value={form.name}
              onChangeText={t => setForm({ ...form, name: t })}
            />

            <Input
              placeholder="Phone"
              value={form.phone}
              onChangeText={t => setForm({ ...form, phone: t })}
            />

            <Input
              placeholder="Department"
              value={form.department}
              onChangeText={t => setForm({ ...form, department: t })}
            />

            <Input
              placeholder="Semester"
              value={form.semester}
              onChangeText={t => setForm({ ...form, semester: t })}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setEditVisible(false)}>
              <Text style={{ textAlign: 'center', marginTop: 10 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================================================= */}
      {/* 🔥 LOGOUT CONFIRM MODAL */}
      {/* ================================================= */}

      <Modal visible={logoutVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Logout?</Text>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <TouchableOpacity onPress={() => setLogoutVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogout}>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

// =================================================
// Components
// =================================================

const Item = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Input = props => <TextInput style={styles.input} {...props} />;

// =================================================
// 🎨 SAME UI STYLES (UNCHANGED)
// =================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ======================
  // HEADER
  // ======================
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#000', // ✅ black header
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 12,
  },

  name: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },

  email: {
    color: '#ccc',
    marginTop: 4,
  },

  // ======================
  // INFO CARD
  // ======================
  section: {
    marginTop: 25,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,

    // soft shadow instead of color
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#E5E5E5',
  },

  label: {
    color: '#777',
  },

  value: {
    fontWeight: '600',
    color: '#000',
  },

  // ======================
  // BUTTONS
  // ======================
  editBtn: {
    marginTop: 25,
    marginHorizontal: 16,
    backgroundColor: '#000', // ✅ black
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  editText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  logoutBtn: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: '#111', // dark grey (not red)
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 40,
  },

  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // ======================
  // MODALS
  // ======================
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },

  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 15,
    color: '#000',
  },

  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    color: '#000',
  },

  saveBtn: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
});
