import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCollection, updateCollectionItem, removeFromCollection, getLocations } from '../utils/database';
import * as ImagePicker from 'expo-image-picker';

export default function CollectionScreen({ navigation }) {
  const [collection, setCollection] = useState([]);
  const [filteredCollection, setFilteredCollection] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [locations, setLocations] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    applyFilters();
  }, [collection, filterStatus, filterLocation]);

  const loadData = async () => {
    const coll = await getCollection();
    setCollection(coll);
    const locs = await getLocations();
    setLocations(locs);
  };

  const applyFilters = () => {
    let filtered = [...collection];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    if (filterLocation !== 'all') {
      filtered = filtered.filter(item => item.location === filterLocation);
    }

    setFilteredCollection(filtered);
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleStatusChange = async (newStatus) => {
    if (selectedItem) {
      await updateCollectionItem(selectedItem.id, { status: newStatus });
      await loadData();
      setSelectedItem({ ...selectedItem, status: newStatus });
    }
  };

  const handleLocationChange = async (newLocation) => {
    if (selectedItem) {
      await updateCollectionItem(selectedItem.id, { location: newLocation });
      await loadData();
      setSelectedItem({ ...selectedItem, location: newLocation });
    }
  };

  const handleNotesChange = async (newNotes) => {
    if (selectedItem) {
      await updateCollectionItem(selectedItem.id, { notes: newNotes });
      setSelectedItem({ ...selectedItem, notes: newNotes });
    }
  };

  const handleAddPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant photo library access to add photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && selectedItem) {
      const photos = selectedItem.photos || [];
      photos.push(result.assets[0].uri);
      await updateCollectionItem(selectedItem.id, { photos });
      await loadData();
      setSelectedItem({ ...selectedItem, photos });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Model',
      'Are you sure you want to remove this model from your collection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await removeFromCollection(selectedItem.id);
            await loadData();
            setModalVisible(false);
            setSelectedItem(null);
          },
        },
      ]
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'unbuilt':
        return 'cube-outline';
      case 'building':
        return 'construct-outline';
      case 'completed':
        return 'checkmark-circle';
      default:
        return 'cube-outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unbuilt':
        return '#757575';
      case 'building':
        return '#FF9800';
      case 'completed':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'unbuilt':
        return 'Unbuilt';
      case 'building':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Unbuilt';
    }
  };

  const renderCollectionCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.modelName}>{item.name}</Text>
          <Text style={styles.modelGrade}>{item.grade}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons name={getStatusIcon(item.status)} size={16} color="#fff" />
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        {item.notes && (
          <View style={styles.detailItem}>
            <Ionicons name="document-text-outline" size={16} color="#666" />
            <Text style={styles.detailText} numberOfLines={1}>
              {item.notes}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const stats = {
    total: collection.length,
    unbuilt: collection.filter(i => i.status === 'unbuilt').length,
    building: collection.filter(i => i.status === 'building').length,
    completed: collection.filter(i => i.status === 'completed').length,
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxUnbuilt]}>
          <Text style={styles.statNumber}>{stats.unbuilt}</Text>
          <Text style={styles.statLabel}>Backlog</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxBuilding]}>
          <Text style={styles.statNumber}>{stats.building}</Text>
          <Text style={styles.statLabel}>Building</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxCompleted]}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>

      <ScrollView horizontal style={styles.filterContainer} showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.filterChip, filterStatus === 'all' && styles.filterChipActive]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={[styles.filterChipText, filterStatus === 'all' && styles.filterChipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filterStatus === 'unbuilt' && styles.filterChipActive]}
          onPress={() => setFilterStatus('unbuilt')}
        >
          <Text style={[styles.filterChipText, filterStatus === 'unbuilt' && styles.filterChipTextActive]}>
            Unbuilt
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filterStatus === 'building' && styles.filterChipActive]}
          onPress={() => setFilterStatus('building')}
        >
          <Text style={[styles.filterChipText, filterStatus === 'building' && styles.filterChipTextActive]}>
            Building
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filterStatus === 'completed' && styles.filterChipActive]}
          onPress={() => setFilterStatus('completed')}
        >
          <Text style={[styles.filterChipText, filterStatus === 'completed' && styles.filterChipTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <FlatList
        data={filteredCollection}
        renderItem={renderCollectionCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No models in collection</Text>
            <Text style={styles.emptySubtext}>Browse models and add them to get started</Text>
          </View>
        }
      />

      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalSectionTitle}>Status</Text>
              <View style={styles.statusButtons}>
                {['unbuilt', 'building', 'completed'].map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.modalStatusButton,
                      selectedItem?.status === status && styles.modalStatusButtonActive,
                      { borderColor: getStatusColor(status) }
                    ]}
                    onPress={() => handleStatusChange(status)}
                  >
                    <Text style={[
                      styles.modalStatusButtonText,
                      selectedItem?.status === status && { color: '#fff' }
                    ]}>
                      {getStatusLabel(status)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalSectionTitle}>Location</Text>
              <View style={styles.locationButtons}>
                {locations.map(loc => (
                  <TouchableOpacity
                    key={loc}
                    style={[
                      styles.modalLocationButton,
                      selectedItem?.location === loc && styles.modalLocationButtonActive
                    ]}
                    onPress={() => handleLocationChange(loc)}
                  >
                    <Text style={[
                      styles.modalLocationButtonText,
                      selectedItem?.location === loc && styles.modalLocationButtonTextActive
                    ]}>
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalSectionTitle}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Add notes..."
                value={selectedItem?.notes || ''}
                onChangeText={handleNotesChange}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.deleteButtonText}>Remove from Collection</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statBoxUnbuilt: {
    borderLeftWidth: 2,
    borderLeftColor: '#757575',
  },
  statBoxBuilding: {
    borderLeftWidth: 2,
    borderLeftColor: '#FF9800',
  },
  statBoxCompleted: {
    borderLeftWidth: 2,
    borderLeftColor: '#4CAF50',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modelGrade: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  cardDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  modalScroll: {
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  modalStatusButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  modalStatusButtonActive: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  modalStatusButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  locationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  modalLocationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  modalLocationButtonActive: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  modalLocationButtonText: {
    fontSize: 14,
    color: '#666',
  },
  modalLocationButtonTextActive: {
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
    marginBottom: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f44336',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
