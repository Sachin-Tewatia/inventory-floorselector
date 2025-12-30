// STATIC DATA - FALLBACK ONLY
// Backend now provides data via API with map_element_id
// This is kept for backward compatibility during migration

export const landmark_description = {
  // By map_element_id (PRIMARY - matches backend map_element_id)
  "eco_park": "Eco Tourism Park, located in Kolkata, India, is a vast urban park spanning over 475 acres. It features themed gardens, water bodies, cycling tracks, and eco-friendly attractions.",
  "city_center_ii": "City Centre II is a shopping mall and lifestyle destination located in Rajarhat, a part of the New Town area of Kolkata, known for its INOX multiplex and various cafes, ice-cream parlors.",
  "nscb_international_airport": "Kolkata's primary airport, offering domestic and international flights, ensuring convenient travel for business and leisure.",
  "biswa_bangla_gate": "Biswa Bangla Gate, Kolkata's iconic skywalk, offers panoramic city views. This architectural marvel features a glass-enclosed gallery.",
  "salt_lake_stadium": "Salt Lake Stadium, Kolkata, is a historic sports venue known for hosting football matches and other events. With a seating capacity of over 85,000, it is one of the largest stadiums in India.",
  "silveroak_estate": "Silver Oak Estate, located in Kolkata, is a luxurious residential complex known for its elegant architecture, lush greenery, and modern amenities.",
  
  // By title (FALLBACK for backward compatibility)
  "Eco Park": "Eco Tourism Park, located in Kolkata, India, is a vast urban park spanning over 475 acres. It features themed gardens, water bodies, cycling tracks, and eco-friendly attractions.",
  "City Center II": "City Centre II is a shopping mall and lifestyle destination located in Rajarhat, a part of the New Town area of Kolkata, known for its INOX multiplex and various cafes, ice-cream parlors.",
  "NSCB International Airport": "Kolkata's primary airport, offering domestic and international flights, ensuring convenient travel for business and leisure.",
  "Biswa Bangla Gate": "Biswa Bangla Gate, Kolkata's iconic skywalk, offers panoramic city views. This architectural marvel features a glass-enclosed gallery.",
  "Salt Lake Stadium": "Salt Lake Stadium, Kolkata, is a historic sports venue known for hosting football matches and other events. With a seating capacity of over 85,000, it is one of the largest stadiums in India.",
  "SilverOak Estate": "Silver Oak Estate, located in Kolkata, is a luxurious residential complex known for its elegant architecture, lush greenery, and modern amenities.",
};

export const distances = {
  // By map_element_id (PRIMARY - matches backend map_element_id)
  "eco_park": 4.2,
  "city_center_ii": 1.2,
  "nscb_international_airport": 5.5,
  "biswa_bangla_gate": 8.3,
  "silveroak_estate": 1,
  "salt_lake_stadium": 13.8,
  
  // By title (FALLBACK for backward compatibility)
  "Eco Park": 4.2,
  "City Center II": 1.2,
  "NSCB International Airport": 5.5,
  "Biswa Bangla Gate": 8.3,
  "SilverOak Estate": 1,
  "Salt Lake Stadium": 13.8,
}