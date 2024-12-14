import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { db } from './firebaseConfig';
import { collectionNames } from '../constants';

const CACHE_KEY = 'firestore_data';
let activeListeners = [];

const fetchAllCollections = async () => {
  try {
    // Check if we have cached data
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      // Return cached data immediately
      console.log('Using cached data');
      return JSON.parse(cachedData).data;
    }

    // If no cache, fetch from Firestor
    return await forceRefreshData();
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
};

// Function to force refresh the data
const forceRefreshData = async () => {
  try {
    console.log('Fetching fresh data from Firestore');
    const data = {};

    for (const name of collectionNames) {
      const snapshot = await getDocs(collection(db, name));
      data[name] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    const dataString = JSON.stringify(data);
    // Cache the new data
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: dataString,
      timestamp: new Date().getTime()
    }));

    return dataString;
  } catch (error) {
    console.error("Error in force refresh:", error);
    throw error;
  }
};

// Setup real-time listeners for all collections
const setupRealtimeSync = (onDataUpdate) => {
  // Clean up any existing listeners
  cleanupListeners();
  
  collectionNames.forEach(name => {
    const q = query(collection(db, name));
    
    // Create listener for each collection
    const unsubscribe = onSnapshot(q, (snapshot) => {
      updateCache(name, snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })), onDataUpdate);
    }, (error) => {
      console.error(`Error in real-time sync for ${name}:`, error);
    });

    activeListeners.push(unsubscribe);
  });

  // Return cleanup function
  return cleanupListeners;
};

// Function to update cache for a specific collection
const updateCache = (collectionName, newData, onDataUpdate) => {
  try {
    // Get cached data
    const cachedDataString = localStorage.getItem(CACHE_KEY);
    const cachedData = cachedDataString ? JSON.parse(cachedDataString).data : '{}';
    const currentData = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    
    // Update the specific collection in cached data
    currentData[collectionName] = newData;

    // Update cache with new data
    const newDataString = JSON.stringify(currentData);
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: newDataString,
      timestamp: new Date().getTime()
    }));

    // Notify the component of updates if callback provided
    if (onDataUpdate) {
      onDataUpdate(newDataString);
    }
  } catch (error) {
    console.error('Error updating cache:', error);
  }
};

// Cleanup function for listeners
const cleanupListeners = () => {
  activeListeners.forEach(unsubscribe => unsubscribe());
  activeListeners = [];
};

export { fetchAllCollections, forceRefreshData, setupRealtimeSync, updateCache };
