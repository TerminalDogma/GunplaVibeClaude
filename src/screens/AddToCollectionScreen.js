import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addToCollection, getLocations, addLocation } from '../utils/database';

export default function AddToCollectionScreen({ route, navigation }) {
  const { model } = route.params;
  const [status, setStatus] = useState('unbuilt');
  const [location, setLocation] = useState('Home');
  const [locations, setLocations] = useState([]);
  const [customLocation, setCustomLocation] = useState('');
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    const locs = await getLocations();
    setLocations(locs);
  };

  const handleAddCustomLocation = async () => {
    if (customLocation.trim()) {
      const updated = await addLocation(customLocation.trim());
      setLocations(updated);
      setLocation(customLocation.trim());
      setCustomLocation('');
      setShowCustomLocation(false);
    }
  };

  const handleSave = async () => {
    const newItem = {
      ...model,
      status,
      location,
      notes,
    };

    const result = await addToCollection(newItem);
    if (result) {
      Alert.alert(
        'Added to Collection!',
        `${model.name} has been added to your collection.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Collection'),
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Failed to add model to collection.');
    }
  };

  const StatusButton = ({ value, icon, label }) => (
    <TouchableOpacity
      style={[styles.statusButton, status === value && styles.statusButtonActive]}
      onPress={() => setStatus(value)}
    >
      <Ionicons
        name={icon}
        size={32}
        color={status === value ? '#fff' : '#E53935'}
      />
      <Text style={[
        styles.statusButtonText,
        status === value && styles.statusButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const LocationButton = ({ value }) => (
    <TouchableOpacity
      style={[styles.locationButton, location === value && styles.locationButtonActive]}
      onPress={() => setLocation(value)}
    >
      <Text style={[
        styles.locationButtonText,
        location === value && styles.locationButtonTextActive
      ]}>
        {value}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.modelInfo}>
          <Text style={styles.modelName}>{model.name}</Text>
          <Text style={styles.modelDetails}>
            {model.grade} • {model.scale}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Build Status</Text>
          <View style={styles.statusButtons}>
            <StatusButton
              value="unbuilt"
              icon="cube-outline"
              label="Unbuilt"
            />
            <StatusButton
              value="building"
              icon="construct-outline"
              label="Building"
            />
            <StatusButton
              value="completed"
              icon="checkmark-circle-outline"
              label="Completed"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity
              onPress={() => setShowCustomLocation(!showCustomLocation)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#E53935" />
            </TouchableOpacity>
          </View>

          {showCustomLocation && (
            <View style={styles.customLocationInput}>
              <TextInput
                style={styles.input}
                placeholder="Enter custom location..."
                value={customLocation}
                onChangeText={setCustomLocation}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddCustomLocation}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.locationButtons}>
            {locations.map(loc => (
              <LocationButton key={loc} value={loc} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add notes about customization, paint job, etc..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Add to Collection</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  modelInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modelDetails: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E53935',
    marginHorizontal: 4,
  },
  statusButtonActive: {
    backgroundColor: '#E53935',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#E53935',
    marginTop: 8,
    fontWeight: '600',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  customLocationInput: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  locationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  locationButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  locationButtonActive: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  locationButtonText: {
    fontSize: 14,
    color: '#666',
  },
  locationButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E53935',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#E53935',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
