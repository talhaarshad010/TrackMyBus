import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { getDistance } from 'geolib';
import stopsData from '../../data/stops.js';

const DEFAULT_LOCATION = {
  latitude: 24.8607,
  longitude: 67.0011,
};

const StopsScreen = () => {
  const [search, setSearch] = useState('');
  const [stops, setStops] = useState(stopsData);

  // ✅ No GPS – safe
  const findNearbyStops = () => {
    const updated = stopsData
      .map(stop => ({
        ...stop,
        distance: getDistance(DEFAULT_LOCATION, {
          latitude: stop.lat,
          longitude: stop.lng,
        }),
      }))
      .sort((a, b) => a.distance - b.distance);

    setStops(updated);
  };

  const filteredStops = stops.filter(stop =>
    stop.name.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Text style={styles.index}>{index + 1}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        {item.distance && (
          <Text style={styles.distance}>
            {(item.distance / 1000).toFixed(2)} km away
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Stops</Text>

      <TextInput
        placeholder="Search stop..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <TouchableOpacity style={styles.button} onPress={findNearbyStops}>
        <Text style={styles.buttonText}>Sort by Nearby</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredStops}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default StopsScreen;

//
// 🎨 Styles
//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  search: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 3,
    alignItems: 'center',
  },

  indexBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  index: {
    color: '#fff',
    fontWeight: 'bold',
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  distance: {
    color: '#666',
    marginTop: 4,
  },
});
