import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Search, Edit2, X, 
  MapPin, Navigation as NavigationIcon,
  Check, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import DashboardWrapper from '../index';
import './MapAdmin.css';
import { getAllLandmarks, getNearbyPlacesByCategory, updateLandmark, updateNearbyPlace } from '../../APIs/mapAdmin';

// Helper function to convert plural category to singular for API
const getCategorySingular = (category) => {
  const mapping = {
    'hotels': 'hotel',
    'schools': 'school',
    'hospitals': 'hospital',
    'malls': 'mall',
    'metros': 'metro',
    'landmarks': 'landmarks'
  };
  return mapping[category] || category;
};

const CATEGORY_CONFIG = {
  landmarks: {
    title: 'Landmarks',
    icon: <MapPin size={24} />,
    color: '#3f608fea',
    hasDescription: true,
    emptyMessage: 'No landmarks added yet'
  },
  hotels: {
    title: 'Hotels',
    icon: <NavigationIcon size={24} />,
    color: '#3f608fea',
    hasDescription: false,
    emptyMessage: 'No hotels added yet'
  },
  schools: {
    title: 'Education',
    icon: <NavigationIcon size={24} />,
    color: '#3f608fea',
    hasDescription: false,
    emptyMessage: 'No schools added yet'
  },
  hospitals: {
    title: 'Healthcare',
    icon: <NavigationIcon size={24} />,
    color: '#3f608fea',
    hasDescription: false,
    emptyMessage: 'No hospitals added yet'
  },
  malls: {
    title: 'Shopping',
    icon: <NavigationIcon size={24} />,
    color: '#3f608fea',
    hasDescription: false,
    emptyMessage: 'No malls added yet'
  },
  metros: {
    title: 'Metro Stations',
    icon: <NavigationIcon size={24} />,
    color: '#3f608fea',
    hasDescription: false,
    emptyMessage: 'No metro stations added yet'
  }
};

const MapAdminManagement = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const config = CATEGORY_CONFIG[category] || {};

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    distance: ''
  });

  // Load data from backend
  const loadData = async () => {
    try {
      setLoading(true);
      
      let data;
      
      if (category === 'landmarks') {
        data = await getAllLandmarks();
      } else {
        const singularCategory = getCategorySingular(category);
        data = await getNearbyPlacesByCategory(singularCategory);
      }
      
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error('Error loading data:', error);
      
      if (error.code === 'ERR_NETWORK') {
        showToast('Cannot connect to backend. Please check if backend is running on port 8000.', 'error');
      } else {
        const errorMsg = error.response?.data?.message || 'Failed to load data';
        showToast(errorMsg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]); // loadData is defined inside component, only run on category change

  useEffect(() => {
    // Filter items based on search query
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      distance: item.distance.toString()
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    if (config.hasDescription && !formData.description.trim()) {
      showToast('Description is required for landmarks', 'error');
      return;
    }

    if (config.hasDescription && formData.description.trim().length < 10) {
      showToast('Description must be at least 10 characters', 'error');
      return;
    }

    if (!formData.distance || parseFloat(formData.distance) <= 0) {
      showToast('Valid distance is required', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const updateData = {
        title: formData.title,
        distance: parseFloat(formData.distance),
        is_active: true
      };

      if (config.hasDescription) {
        updateData.description = formData.description;
      } else {
        const singularCategory = getCategorySingular(category);
        updateData.category = singularCategory;
      }

      let result;
      if (category === 'landmarks') {
        result = await updateLandmark(editingItem._id, updateData);
      } else {
        result = await updateNearbyPlace(editingItem._id, updateData);
      }

      showToast(result.message || `${formData.title} has been updated successfully`, 'success');
      
      // Reload data
      await loadData();
      
      setIsModalOpen(false);
      setFormData({ title: '', description: '', distance: '' });
    } catch (error) {
      console.error('Error updating:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
      <div className="map-admin-management">
        <div className="management-container">
        <div className="management-header">
          <div className="header-info">
            <h1 style={{ color: config.color }}>
              {config.icon}
              {config.title}
            </h1>
            <p className="subtitle">
              Update and manage {config.title.toLowerCase()} information
            </p>
          </div>
          <button 
            className="btn-back-only"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        <div className="content-section">
          <div className="search-bar">
            <div style={{ position: 'relative' }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#cbd5e0'
                }} 
              />
              <input
                type="text"
                className="search-input"
                placeholder={`Search ${config.title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>

          <div className="items-grid">
            {loading ? (
              <div className="empty-state">
                <div className="loader"></div>
                <h3>Loading {config.title.toLowerCase()}...</h3>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="empty-state">
                {config.icon}
                <h3>{searchQuery ? 'No results found' : config.emptyMessage}</h3>
                <p>
                  {searchQuery 
                    ? 'Try a different search term' 
                    : `No ${category} available at the moment`
                  }
                </p>
              </div>
            ) : (
              filteredItems.map(item => (
                <div key={item._id} className="item-card">
                  <div className="item-header">
                    <h3 className="item-title">{item.title}</h3>
                    <button 
                      className="btn-edit-modern"
                      onClick={() => handleEdit(item)}
                      style={{ color: config.color, borderColor: config.color }}
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                  </div>
                  {item.description && category === 'landmarks' && (
                    <p className="item-description">{item.description}</p>
                  )}
                  <div className="item-details">
                    <div className="detail-item">
                      <NavigationIcon size={16} />
                      <span>{item.distance} km</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit {category.slice(0, -1)}</h2>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter title"
                    required
                  />
                </div>

                {config.hasDescription && (
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter description"
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Distance (km) *</label>
                  <input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleInputChange}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ backgroundColor: config.color }}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}
      </div>
  );
};

export default MapAdminManagement;

