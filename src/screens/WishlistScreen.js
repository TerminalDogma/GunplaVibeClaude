import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getWishlist, removeFromWishlist, updateCollectionItem } from '../utils/database';

export default function WishlistScreen({ navigation }) {
  const [wishlist, setWishlist] = useState([]);
  const [sortBy, setSortBy] = useState('date'); // date, priority, price

  useEffect(() => {
    loadWishlist();
    const unsubscribe = navigation.addListener('focus', loadWishlist);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    sortWishlist();
  }, [sortBy]);

  const loadWishlist = async () => {
    const list = await getWishlist();
    setWishlist(list);
  };

  const sortWishlist = () => {
    const sorted = [...wishlist];
    
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'price':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'date':
      default:
        sorted.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        break;
    }
    
    setWishlist(sorted);
  };

  const handleRemove = (item) => {
    Alert.alert(
      'Remove from Wishlist',
      `Remove ${item.name} from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeFromWishlist(item.id);
            await loadWishlist();
          },
        },
      ]
    );
  };

  const handleMoveToCollection = (item) => {
    navigation.navigate('AddToCollection', { model: item });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#E53935';
      case 'medium':
        return '#FF9800';
      case 'low':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const renderWishlistCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ModelDetail', { model: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.modelName}>{item.name}</Text>
          <Text style={styles.modelDetails}>{item.grade} • {item.scale}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>
            {item.priority?.toUpperCase() || 'MEDIUM'}
          </Text>
        </View>
      </View>

      <Text style={styles.series}>{item.series}</Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleMoveToCollection(item)}
          >
            <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Add to Collection</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(item)}
          >
            <Ionicons name="close-circle-outline" size={20} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const totalValue = wishlist.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{wishlist.length}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>${totalValue.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
        </View>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}
            onPress={() => setSortBy('date')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>
              Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'priority' && styles.sortButtonActive]}
            onPress={() => setSortBy('priority')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'priority' && styles.sortButtonTextActive]}>
              Priority
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'price' && styles.sortButtonActive]}
            onPress={() => setSortBy('price')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'price' && styles.sortButtonTextActive]}>
              Price
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={wishlist}
        renderItem={renderWishlistCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtext}>Browse models and add ones you want to buy</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E53935',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
  },
  sortButtonTextActive: {
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
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modelDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  series: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  removeButton: {
    padding: 8,
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
});
