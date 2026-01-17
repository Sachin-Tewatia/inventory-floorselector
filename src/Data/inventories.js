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
  if (onInventoriesChangeCallback) {
    onInventoriesChangeCallback(inventories);
  }
};

export { inventories };
