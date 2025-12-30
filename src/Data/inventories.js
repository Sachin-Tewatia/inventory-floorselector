import { useState } from 'react';
let inventories = [];
let onInventoriesChangeCallback = null;

// Function to set callback for when inventories change
export const setInventoriesChangeCallback = (callback) => {
  onInventoriesChangeCallback = callback;
};

// Function to get current inventories
export const getInventories = () => inventories;

// Function to set inventories and notify React components
export const setInventories = (_inventories) => {
  inventories = [..._inventories];
  console.log("📊 inventories.js: Inventories updated:", inventories.length, "items");
  
  // Notify React components if callback is set
  if (onInventoriesChangeCallback) {
    console.log("🔄 inventories.js: Notifying React components of inventory change");
    onInventoriesChangeCallback(inventories);
  }
};

export { inventories };
