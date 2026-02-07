import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  COLLECTION: '@gunpla_collection',
  WISHLIST: '@gunpla_wishlist',
  MASTER_CATALOG: '@gunpla_master_catalog',
  LOCATIONS: '@gunpla_locations',
};

// Default locations
const DEFAULT_LOCATIONS = ['Home', 'Storage', 'Work', 'Display Case'];

// Initialize default locations
export const initializeLocations = async () => {
  try {
    const existing = await AsyncStorage.getItem(KEYS.LOCATIONS);
    if (!existing) {
      await AsyncStorage.setItem(KEYS.LOCATIONS, JSON.stringify(DEFAULT_LOCATIONS));
    }
  } catch (error) {
    console.error('Error initializing locations:', error);
  }
};

// Get all locations
export const getLocations = async () => {
  try {
    const locations = await AsyncStorage.getItem(KEYS.LOCATIONS);
    return locations ? JSON.parse(locations) : DEFAULT_LOCATIONS;
  } catch (error) {
    console.error('Error getting locations:', error);
    return DEFAULT_LOCATIONS;
  }
};

// Add custom location
export const addLocation = async (location) => {
  try {
    const locations = await getLocations();
    if (!locations.includes(location)) {
      locations.push(location);
      await AsyncStorage.setItem(KEYS.LOCATIONS, JSON.stringify(locations));
    }
    return locations;
  } catch (error) {
    console.error('Error adding location:', error);
    return [];
  }
};

// Collection Management
export const getCollection = async () => {
  try {
    const collection = await AsyncStorage.getItem(KEYS.COLLECTION);
    return collection ? JSON.parse(collection) : [];
  } catch (error) {
    console.error('Error getting collection:', error);
    return [];
  }
};

export const saveCollection = async (collection) => {
  try {
    await AsyncStorage.setItem(KEYS.COLLECTION, JSON.stringify(collection));
    return true;
  } catch (error) {
    console.error('Error saving collection:', error);
    return false;
  }
};

export const addToCollection = async (model) => {
  try {
    const collection = await getCollection();
    const newItem = {
      ...model,
      id: Date.now().toString(),
      addedDate: new Date().toISOString(),
      status: 'unbuilt', // unbuilt, building, completed
      location: 'Home',
      photos: [],
      notes: '',
    };
    collection.push(newItem);
    await saveCollection(collection);
    return newItem;
  } catch (error) {
    console.error('Error adding to collection:', error);
    return null;
  }
};

export const updateCollectionItem = async (id, updates) => {
  try {
    const collection = await getCollection();
    const index = collection.findIndex(item => item.id === id);
    if (index !== -1) {
      collection[index] = { ...collection[index], ...updates };
      await saveCollection(collection);
      return collection[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating collection item:', error);
    return null;
  }
};

export const removeFromCollection = async (id) => {
  try {
    const collection = await getCollection();
    const filtered = collection.filter(item => item.id !== id);
    await saveCollection(filtered);
    return true;
  } catch (error) {
    console.error('Error removing from collection:', error);
    return false;
  }
};

// Wishlist Management
export const getWishlist = async () => {
  try {
    const wishlist = await AsyncStorage.getItem(KEYS.WISHLIST);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

export const saveWishlist = async (wishlist) => {
  try {
    await AsyncStorage.setItem(KEYS.WISHLIST, JSON.stringify(wishlist));
    return true;
  } catch (error) {
    console.error('Error saving wishlist:', error);
    return false;
  }
};

export const addToWishlist = async (model) => {
  try {
    const wishlist = await getWishlist();
    const newItem = {
      ...model,
      id: Date.now().toString(),
      addedDate: new Date().toISOString(),
      priority: 'medium', // low, medium, high
      notes: '',
    };
    wishlist.push(newItem);
    await saveWishlist(wishlist);
    return newItem;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return null;
  }
};

export const removeFromWishlist = async (id) => {
  try {
    const wishlist = await getWishlist();
    const filtered = wishlist.filter(item => item.id !== id);
    await saveWishlist(filtered);
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
};

// Master Catalog Management
export const getMasterCatalog = async () => {
  try {
    const catalog = await AsyncStorage.getItem(KEYS.MASTER_CATALOG);
    return catalog ? JSON.parse(catalog) : [];
  } catch (error) {
    console.error('Error getting master catalog:', error);
    return [];
  }
};

export const saveMasterCatalog = async (catalog) => {
  try {
    await AsyncStorage.setItem(KEYS.MASTER_CATALOG, JSON.stringify(catalog));
    return true;
  } catch (error) {
    console.error('Error saving master catalog:', error);
    return false;
  }
};

// Search and filter
export const searchModels = async (query, filters = {}) => {
  try {
    const catalog = await getMasterCatalog();
    let results = catalog;

    // Text search
    if (query && query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(model => 
        model.name.toLowerCase().includes(lowerQuery) ||
        model.series?.toLowerCase().includes(lowerQuery) ||
        model.modelNumber?.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply filters
    if (filters.grade && filters.grade.length > 0) {
      results = results.filter(model => filters.grade.includes(model.grade));
    }
    if (filters.series && filters.series.length > 0) {
      results = results.filter(model => filters.series.includes(model.series));
    }
    if (filters.scale && filters.scale.length > 0) {
      results = results.filter(model => filters.scale.includes(model.scale));
    }
    if (filters.yearFrom) {
      results = results.filter(model => model.releaseYear >= filters.yearFrom);
    }
    if (filters.yearTo) {
      results = results.filter(model => model.releaseYear <= filters.yearTo);
    }

    return results;
  } catch (error) {
    console.error('Error searching models:', error);
    return [];
  }
};
