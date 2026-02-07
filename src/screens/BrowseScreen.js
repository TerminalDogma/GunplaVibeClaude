import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMasterCatalog, saveMasterCatalog, searchModels } from '../utils/database';
import { SAMPLE_GUNPLA_DATA, getAllGrades, getAllSeries, getAllScales } from '../data/sampleData';

export default function BrowseScreen({ navigation }) {
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  
  // Filter states
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [selectedScales, setSelectedScales] = useState([]);

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchQuery, selectedGrades, selectedSeries, selectedScales, models]);

  const loadCatalog = async () => {
    try {
      let catalog = await getMasterCatalog();
      
      // If empty, initialize with sample data
      if (catalog.length === 0) {
        catalog = SAMPLE_GUNPLA_DATA;
        await saveMasterCatalog(catalog);
      }
      
      setModels(catalog);
      setFilteredModels(catalog);
    } catch (error) {
      console.error('Error loading catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = async () => {
    const filters = {
      grade: selectedGrades,
      series: selectedSeries,
      scale: selectedScales,
    };
    
    const results = await searchModels(searchQuery, filters);
    setFilteredModels(results);
  };

  const toggleFilter = (filterArray, setFilterArray, value) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter(item => item !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  const clearFilters = () => {
    setSelectedGrades([]);
    setSelectedSeries([]);
    setSelectedScales([]);
    setSearchQuery('');
  };

  const renderModelCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ModelDetail', { model: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.modelName}>{item.name}</Text>
        <Text style={styles.modelNumber}>{item.modelNumber}</Text>
      </View>
      
      <View style={styles.cardDetails}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.grade}</Text>
        </View>
        <Text style={styles.scale}>{item.scale}</Text>
      </View>
      
      <Text style={styles.series}>{item.series}</Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.year}>{item.releaseYear}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const FilterModal = () => (
    <Modal
      visible={filterVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setFilterVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setFilterVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterScroll}>
            {/* Grade Filter */}
            <Text style={styles.filterSectionTitle}>Grade</Text>
            <View style={styles.filterButtons}>
              {getAllGrades().map(grade => (
                <TouchableOpacity
                  key={grade}
                  style={[
                    styles.filterButton,
                    selectedGrades.includes(grade) && styles.filterButtonActive
                  ]}
                  onPress={() => toggleFilter(selectedGrades, setSelectedGrades, grade)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedGrades.includes(grade) && styles.filterButtonTextActive
                  ]}>
                    {grade}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Series Filter */}
            <Text style={styles.filterSectionTitle}>Series</Text>
            <View style={styles.filterButtons}>
              {getAllSeries().map(series => (
                <TouchableOpacity
                  key={series}
                  style={[
                    styles.filterButton,
                    selectedSeries.includes(series) && styles.filterButtonActive
                  ]}
                  onPress={() => toggleFilter(selectedSeries, setSelectedSeries, series)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedSeries.includes(series) && styles.filterButtonTextActive
                  ]}>
                    {series}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Scale Filter */}
            <Text style={styles.filterSectionTitle}>Scale</Text>
            <View style={styles.filterButtons}>
              {getAllScales().map(scale => (
                <TouchableOpacity
                  key={scale}
                  style={[
                    styles.filterButton,
                    selectedScales.includes(scale) && styles.filterButtonActive
                  ]}
                  onPress={() => toggleFilter(selectedScales, setSelectedScales, scale)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedScales.includes(scale) && styles.filterButtonTextActive
                  ]}>
                    {scale}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  const activeFilterCount = selectedGrades.length + selectedSeries.length + selectedScales.length;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search models, series, or model number..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter" size={20} color="#E53935" />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''}
        </Text>
        /* <TouchableOpacity onPress={() => navigation.navigate('ScanBarcode')}>
          <Ionicons name="barcode-outline" size={24} color="#E53935" />
        </TouchableOpacity> */
      </View>

      <FlatList
        data={filteredModels}
        renderItem={renderModelCard}
        keyExtractor={(item, index) => `${item.modelNumber}-${item.grade}-${index}`}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No models found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />

      <FilterModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E53935',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E53935',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 8,
  },
  modelName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modelNumber: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scale: {
    fontSize: 14,
    color: '#666',
  },
  series: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
  year: {
    fontSize: 14,
    color: '#999',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E53935',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterScroll: {
    padding: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  filterButtonActive: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E53935',
    marginRight: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#E53935',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
