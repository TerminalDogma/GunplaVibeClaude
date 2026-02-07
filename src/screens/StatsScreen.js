import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCollection, getWishlist } from '../utils/database';

const { width } = Dimensions.get('window');

export default function StatsScreen({ navigation }) {
  const [collection, setCollection] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const coll = await getCollection();
    const wish = await getWishlist();
    setCollection(coll);
    setWishlist(wish);
    calculateStats(coll, wish);
  };

  const calculateStats = (coll, wish) => {
    // Status breakdown
    const statusCounts = {
      unbuilt: coll.filter(i => i.status === 'unbuilt').length,
      building: coll.filter(i => i.status === 'building').length,
      completed: coll.filter(i => i.status === 'completed').length,
    };

    // Grade breakdown
    const gradeCounts = {};
    coll.forEach(item => {
      gradeCounts[item.grade] = (gradeCounts[item.grade] || 0) + 1;
    });

    // Series breakdown
    const seriesCounts = {};
    coll.forEach(item => {
      seriesCounts[item.series] = (seriesCounts[item.series] || 0) + 1;
    });

    // Location breakdown
    const locationCounts = {};
    coll.forEach(item => {
      locationCounts[item.location] = (locationCounts[item.location] || 0) + 1;
    });

    // Value calculations
    const collectionValue = coll.reduce((sum, item) => sum + (item.price || 0), 0);
    const wishlistValue = wish.reduce((sum, item) => sum + (item.price || 0), 0);

    // Completion rate
    const completionRate = coll.length > 0 
      ? ((statusCounts.completed / coll.length) * 100).toFixed(1)
      : 0;

    setStats({
      statusCounts,
      gradeCounts,
      seriesCounts,
      locationCounts,
      collectionValue,
      wishlistValue,
      completionRate,
      totalModels: coll.length,
      wishlistCount: wish.length,
    });
  };

  const StatCard = ({ icon, label, value, color = '#E53935', subtitle }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const BreakdownCard = ({ title, data, icon }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);

    return (
      <View style={styles.breakdownCard}>
        <View style={styles.breakdownHeader}>
          <Ionicons name={icon} size={20} color="#E53935" />
          <Text style={styles.breakdownTitle}>{title}</Text>
        </View>
        {sortedData.map(([key, value]) => {
          const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
          return (
            <View key={key} style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>{key}</Text>
              <View style={styles.breakdownRight}>
                <View style={styles.breakdownBarContainer}>
                  <View 
                    style={[
                      styles.breakdownBar, 
                      { width: `${percentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.breakdownValue}>{value}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  if (!stats.totalModels && stats.totalModels !== 0) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        
        <View style={styles.statsGrid}>
          <StatCard
            icon="cube"
            label="Total Models"
            value={stats.totalModels}
            color="#E53935"
          />
          <StatCard
            icon="heart"
            label="Wishlist"
            value={stats.wishlistCount}
            color="#FF9800"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="checkmark-done"
            label="Completion Rate"
            value={`${stats.completionRate}%`}
            color="#4CAF50"
            subtitle={`${stats.statusCounts?.completed || 0} completed`}
          />
          <StatCard
            icon="cash"
            label="Collection Value"
            value={`$${stats.collectionValue?.toFixed(0) || 0}`}
            color="#2196F3"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Build Status</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: '#757575' }]} />
            <Text style={styles.statusText}>Unbuilt</Text>
            <Text style={styles.statusCount}>{stats.statusCounts?.unbuilt || 0}</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.statusText}>Building</Text>
            <Text style={styles.statusCount}>{stats.statusCounts?.building || 0}</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.statusText}>Completed</Text>
            <Text style={styles.statusCount}>{stats.statusCounts?.completed || 0}</Text>
          </View>
        </View>
      </View>

      {Object.keys(stats.gradeCounts || {}).length > 0 && (
        <BreakdownCard
          title="By Grade"
          data={stats.gradeCounts}
          icon="layers-outline"
        />
      )}

      {Object.keys(stats.seriesCounts || {}).length > 0 && (
        <BreakdownCard
          title="By Series"
          data={stats.seriesCounts}
          icon="film-outline"
        />
      )}

      {Object.keys(stats.locationCounts || {}).length > 0 && (
        <BreakdownCard
          title="By Location"
          data={stats.locationCounts}
          icon="location-outline"
        />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.financialCard}>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Collection Value</Text>
            <Text style={styles.financialValue}>
              ${stats.collectionValue?.toFixed(2) || '0.00'}
            </Text>
          </View>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Wishlist Value</Text>
            <Text style={styles.financialValue}>
              ${stats.wishlistValue?.toFixed(2) || '0.00'}
            </Text>
          </View>
          <View style={[styles.financialRow, styles.financialTotal]}>
            <Text style={styles.financialLabelBold}>Total Investment</Text>
            <Text style={styles.financialValueBold}>
              ${((stats.collectionValue || 0) + (stats.wishlistValue || 0)).toFixed(2)}
            </Text>
          </View>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Average per Model</Text>
            <Text style={styles.financialValue}>
              ${stats.totalModels > 0 
                ? (stats.collectionValue / stats.totalModels).toFixed(2)
                : '0.00'
              }
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  statusContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  statusCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  breakdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  breakdownBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  breakdownBar: {
    height: '100%',
    backgroundColor: '#E53935',
    borderRadius: 4,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    width: 30,
    textAlign: 'right',
  },
  financialCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  financialTotal: {
    borderTopWidth: 2,
    borderTopColor: '#E53935',
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 16,
  },
  financialLabel: {
    fontSize: 14,
    color: '#666',
  },
  financialValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  financialLabelBold: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  financialValueBold: {
    fontSize: 20,
    color: '#E53935',
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 32,
  },
});
