# Inventory Bot Frontend Integration Guide

This guide details how to integrate the **Inventory Bot** mode of the Floor Selector Chatbot API into your frontend application. The Inventory Bot is specialized for floor plans, unit availability, tower status, and virtual tours.

---

## 🏗️ Overview

The Inventory Bot handles all queries related to the physical project structure:
- **Tower & Floor Information**: Listing available towers and floors.
- **Unit Availability**: Real-time status of apartments (Available, Booked, Sold).
- **Unit Specifications**: Price (Crores/Lakhs), Area (sqft), and configuration (2 BHK, 3 BHK, etc.).
- **Virtual Tours**: Navigating to 3D/VR representations of unit types.
- **Direct Navigation**: Taking the user to specific unit detail pages.

---

## 🔗 Base URL

- **Development**: `http://localhost:8001`
- **Production**: `https://api.floorselector.convrse.ai` (Example)

---

## 🤖 Activating Inventory Mode

To ensure the chatbot functions as an **Inventory Bot** (and does not use location-based tools like school/hospital lookups), the frontend must send a specific `map_type` or omit it.

| Requirement | Value | Note |
|-------------|-------|------|
| **`map_type`** | `null`, `"inventory"`, or `"floorplan"` | Avoid keywords: *location, nearby, 5km, 10km, map* |
| **`project_id`** | `"avant_heritage"` (example) | Required for all inventory lookups. |

---

## 💬 Chat Endpoint (`POST /chat`)

The primary endpoint for Inventory Bot interactions.

### Request Payload
```json
{
  "message": "Show me the most expensive 3 BHK in Tower A",
  "project_id": "avant_heritage",
  "session_id": "sess_01JHGHA...",
  "user_id": "user_456",
  "map_type": "inventory" 
}
```

### Response Object (Inventory Focus)
```json
{
  "response": "The most expensive 3 BHK in Tower A is Unit 1804 on the 18th floor...",
  "navigation_target": "/avant/unit/a_18_04",
  "highlighted_units": [
    {
      "unit_number": "1804",
      "tower": "A",
      "floor": "18",
      "total_cost": "2.45 Cr",
      "svg_id": "a_18_4",
      "potential_svg_ids": ["a_18_4"]
    }
  ],
  "history": [...],
  "audio_stream_url": "..."
}
```

---

## 🛠️ Specialized Responses

### 1. Unit Highlighting (`highlighted_units`)
When a user asks for specific units (e.g., "Show me available 2 BHKs on the 5th floor"), the response includes a list of units to be visually highlighted in your UI.

- **`svg_id`**: Use this to match elements in your SVG/Interactive map (format: `{tower}_{floor}_{suffix}`).
- **`potential_svg_ids`**: For complex units (like duplexes) that might span multiple SVG elements.

### 2. Internal Navigation (`navigation_target`)
If the user asks "Take me to unit 101", the API provides a relative path.
**Frontend Implementation:**
```javascript
if (data.navigation_target) {
  myRouter.push(data.navigation_target);
}
```

### 3. VR Tour Redirection (`external_url`)
Requested when the user says "Show me a 2 BHK tour".
**Frontend Implementation:**
```javascript
if (data.external_url) {
  window.open(data.external_url, '_blank');
}
```

---

## 📡 Available Tools (Backend Capabilities)

The Inventory Bot has exclusive access to these tools. Forcing these tools ensures the AI remains focused on the project inventory.

1. **`get_floors`**: Lists floors for a tower.
2. **`get_towers`**: Lists all towers in the project.
3. **`get_unit_types`**: Lists available BHK configurations.
4. **`get_units`**: Searches for units by floor, price, area, or status.
5. **`navigate_to_unit_page`**: Triggers internal routing.
6. **`navigate_to_vr_tour`**: Provides external VR links.

---

## 💡 Best Practices

1. **Unit Suffixes**: The `svg_id` generation logic automatically cleans unit numbers (e.g., `101` becomes suffix `1`). Ensure your SVG IDs match the `{tower}_{floor}_{suffix}` pattern.
2. **Price Formatting**: The bot will always respond in **Lakhs** and **Crores**. Ensure your UI labels match this Indian numbering system for consistency.
3. **Deep Linking**: Use the `navigation_target` to allow users to "jump" straight into the inventory details from the chat window.

---

## 🧪 Testing Inventory Mode

To verify the bot is correctly restricted to Inventory tasks, try these queries:
- ✅ *Valid:* "Which tower has the most available units?"
- ✅ *Valid:* "Show me a 2.5 BHK virtual tour."
- ❌ *Restricted:* "What schools are near here?" (The bot should respond that it is an inventory assistant or that the tool is unavailable if properly configured).

---
© 2025 Convrse AI. All rights reserved.

