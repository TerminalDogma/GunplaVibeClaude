import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addToWishlist, getWishlist, getCollection } from '../utils/database';

export default function ModelDetailScreen({ route, navigation }) {
  const { model } = route.params;
  const [inWishlist, setInWishlist] = useState(false);
  const [inCollection, setInCollection] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const wishlist = await getWishlist();
    const collection = await getCollection();
    
    setInWishlist(wishlist.some(item => 
      item.modelNumber === model.modelNumber && item.grade === model.grade
    ));
    
    setInCollection(collection.some(item => 
      item.modelNumber === model.modelNumber && item.grade === model.grade
    ));
  };

  const handleAddToWishlist = async () => {
    if (inWishlist) {
      Alert.alert('Already in Wishlist', 'This model is already in your wishlist.');
      return;
    }

    const result = await addToWishlist(model);
    if (result) {
      setInWishlist(true);
      Alert.alert('Added!', 'Model added to your wishlist.');
    }
  };

  const handleAddToCollection = () => {
    if (inCollection) {
      Alert.alert('Already Owned', 'This model is already in your collection.');
      return;
    }
    
    navigation.navigate('AddToCollection', { model });
  };

  const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailLabel}>
        <Ionicons name={icon} size={20} color="#E53935" style={styles.detailIcon} />
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.modelName}>{model.name}</Text>
          <Text style={styles.modelNumber}>{model.modelNumber}</Text>
        </View>

        <View style={styles.badges}>
          <View style={styles.gradeBadge}>
            <Text style={styles.gradeBadgeText}>{model.grade}</Text>
          </View>
          <View style={styles.scaleBadge}>
            <Text style={styles.scaleBadgeText}>{model.scale}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <DetailRow 
            icon="film-outline" 
            label="Series" 
            value={model.series} 
          />
          <DetailRow 
            icon="business-outline" 
            label="Manufacturer" 
            value={model.manufacturer} 
          />
          <DetailRow 
            icon="calendar-outline" 
            label="Release Year" 
            value={model.releaseYear.toString()} 
          />
          <DetailRow 
            icon="pricetag-outline" 
            label="MSRP" 
            value={`$${model.price.toFixed(2)}`} 
          />
          {model.barcode && (
            <DetailRow 
              icon="barcode-outline" 
              label="Barcode" 
              value={model.barcode} 
            />
          )}
        </View>

        {model.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{model.description}</Text>
          </View>
        )}

        {inCollection && (
          <View style={styles.ownedBanner}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.ownedText}>You own this model</Text>
          </View>
        )}

        {inWishlist && (
          <View style={styles.wishlistBanner}>
            <Ionicons name="heart" size={24} color="#E53935" />
            <Text style={styles.wishlistText}>In your wishlist</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.wishlistButton, inWishlist && styles.buttonDisabled]}
          onPress={handleAddToWishlist}
          disabled={inWishlist}
        >
          <Ionicons 
            name={inWishlist ? "heart" : "heart-outline"} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.buttonText}>
            {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.collectionButton, inCollection && styles.buttonDisabled]}
          onPress={handleAddToCollection}
          disabled={inCollection}
        >
          <Ionicons 
            name={inCollection ? "checkmark-circle" : "add-circle-outline"} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.buttonText}>
            {inCollection ? 'Owned' : 'Add to Collection'}
          </Text>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modelNumber: {
    fontSize: 16,
    color: '#666',
  },
  badges: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
  },
  gradeBadge: {
    backgroundColor: '#E53935',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  gradeBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scaleBadge: {
    backgroundColor: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scaleBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 8,
  },
  labelText: {
    fontSize: 16,
    color: '#666',
  },
  valueText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  ownedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  ownedText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  wishlistBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  wishlistText: {
    fontSize: 16,
    color: '#E53935',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  wishlistButton: {
    backgroundColor: '#E53935',
  },
  collectionButton: {
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
