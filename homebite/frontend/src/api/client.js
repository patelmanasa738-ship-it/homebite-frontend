import axios from 'axios';

// Get API URL from Vite environment or default to local Spring Boot 8080
const rawApiUrl = import.meta.env.VITE_API_URL || 'https://homebite-backend-5.onrender.com/api';
export const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 25000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('homebite_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback Mock Store for testing when Spring Boot is offline
const INITIAL_MOCK_DISHES = [
  {
    id: 1,
    cookId: 1,
    cookName: 'Maria Rossi',
    kitchenName: "Nonna's Hearth & Pasta",
    name: 'Slow-Baked Ragu Lasagna',
    description: 'Layers of handmade sheet pasta, 6-hour simmered beef & pancetta bolognese, silky béchamel, and melted aged Parmigiano Reggiano.',
    category: 'Italian',
    price: 16.50,
    prepTimeMinutes: 45,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    imageUrl: '/src/assets/images/dish_lasagna_1791702722110.jpg',
    averageRating: 4.9,
    reviewCount: 32,
  },
  {
    id: 2,
    cookId: 1,
    cookName: 'Maria Rossi',
    kitchenName: "Nonna's Hearth & Pasta",
    name: 'Handmade Spinach Ricotta Ravioli',
    description: 'Fresh delicate pasta parcels stuffed with whipped organic ricotta and baby spinach in browned butter sage reduction.',
    category: 'Italian',
    price: 14.50,
    prepTimeMinutes: 30,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?auto=format&fit=crop&w=800&q=80',
    averageRating: 4.8,
    reviewCount: 19,
  },
  {
    id: 3,
    cookId: 2,
    cookName: 'Rajesh Sharma',
    kitchenName: 'Spice Harmony Kitchen',
    name: 'Heritage Butter Chicken & Naan',
    description: 'Tender charred tandoori chicken simmered in a velvety tomato-fenugreek sauce, served with garlic naan and fragrant basmati.',
    category: 'Indian',
    price: 17.00,
    prepTimeMinutes: 35,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    imageUrl: '/src/assets/images/dish_curry_1791702733069.jpg',
    averageRating: 4.9,
    reviewCount: 41,
  },
  {
    id: 4,
    cookId: 3,
    cookName: 'Chef Lin Wei',
    kitchenName: 'Lotus Steam & Wok',
    name: 'Artisanal Steamed Dim Sum Platter',
    description: 'Handcrafted crystal shrimp har gow, pork & mushroom siu mai, and pan-crisped potstickers with chili crisp dipping sauce.',
    category: 'Asian',
    price: 15.50,
    prepTimeMinutes: 25,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    imageUrl: '/src/assets/images/dish_dumplings_1791702745897.jpg',
    averageRating: 4.95,
    reviewCount: 28,
  }
];

const INITIAL_MOCK_COOKS = [
  {
    id: 1,
    userId: 2,
    cookName: 'Maria Rossi',
    kitchenName: "Nonna's Hearth & Pasta",
    bio: 'Cooking authentic Northern Italian recipes handed down through four generations in Bologna. Fresh handmade pasta made every single morning.',
    specialty: 'Italian Artisanal & Handmade Pasta',
    kitchenAddress: '42 Maple Street, Northside Neighborhood',
    isVerified: true,
    ratingAvg: 4.92,
    ratingCount: 51,
    bannerUrl: '/src/assets/images/hero_home_cooking_1791702710190.jpg',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2,
    userId: 3,
    cookName: 'Rajesh Sharma',
    kitchenName: 'Spice Harmony Kitchen',
    bio: 'Homestyle traditional North and South Indian delicacies cooked with freshly stone-ground spices, organic ghee, and whole grain flours.',
    specialty: 'Traditional Indian & Slow Curries',
    kitchenAddress: '18 Oakwood Avenue, Westside Neighborhood',
    isVerified: true,
    ratingAvg: 4.88,
    ratingCount: 39,
    bannerUrl: '/src/assets/images/dish_curry_1791702733069.jpg',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 3,
    userId: 5,
    cookName: 'Chef Lin Wei',
    kitchenName: 'Lotus Steam & Wok',
    bio: 'Bringing the authentic warmth of Cantonese and Sichuan family banquets. Hand-folded dumplings and slow-steamed broths.',
    specialty: 'Handcrafted Dim Sum & Dumplings',
    kitchenAddress: '88 Cedar Lane, Chinatown District',
    isVerified: true,
    ratingAvg: 4.95,
    ratingCount: 31,
    bannerUrl: '/src/assets/images/dish_dumplings_1791702745897.jpg',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  }
];

function getMockStorage(key, fallback) {
  try {
    const item = localStorage.getItem(`homebite_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setMockStorage(key, val) {
  try {
    localStorage.setItem(`homebite_${key}`, JSON.stringify(val));
  } catch (e) {
    console.warn(e);
  }
}

// API Service with seamless Spring Boot connection & graceful fallback
export const authApi = {
  login: async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      return res.data;
    } catch (err) {
      if (err.response) throw err;
      // Mock Fallback
      const email = credentials.email.toLowerCase();
      let role = 'CUSTOMER';
      let cookProfileId = null;
      let fullName = 'Emily Watson';

      if (email.includes('admin')) {
        role = 'ADMIN';
        fullName = 'Admin Supervisor';
      } else if (email.includes('maria') || email.includes('cook')) {
        role = 'COOK';
        cookProfileId = 1;
        fullName = 'Maria Rossi';
      }

      return {
        token: 'mock-jwt-token-' + Date.now(),
        id: 101,
        email,
        fullName,
        role,
        cookProfileId
      };
    }
  },

  registerCustomer: async (data) => {
    try {
      const res = await api.post('/auth/register/customer', data);
      return res.data;
    } catch (err) {
      if (err.response) throw err;
      return {
        token: 'mock-jwt-token-' + Date.now(),
        id: Date.now(),
        email: data.email,
        fullName: data.fullName,
        role: 'CUSTOMER',
        cookProfileId: null
      };
    }
  },

  registerCook: async (data) => {
    try {
      const res = await api.post('/auth/register/cook', data);
      return res.data;
    } catch (err) {
      if (err.response) throw err;
      const newCook = {
        id: Date.now(),
        userId: Date.now(),
        cookName: data.fullName,
        kitchenName: data.kitchenName,
        bio: data.bio || 'Passionate homemade chef sharing family classics.',
        specialty: data.specialty || 'Home Cooking',
        kitchenAddress: data.kitchenAddress || 'Local Neighborhood Kitchen',
        isVerified: true,
        ratingAvg: 5.0,
        ratingCount: 0,
        bannerUrl: '/src/assets/images/hero_home_cooking_1791702710190.jpg'
      };
      const cooks = getMockStorage('cooks', INITIAL_MOCK_COOKS);
      setMockStorage('cooks', [...cooks, newCook]);

      return {
        token: 'mock-jwt-token-' + Date.now(),
        id: newCook.userId,
        email: data.email,
        fullName: data.fullName,
        role: 'COOK',
        cookProfileId: newCook.id
      };
    }
  },

  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err) {
      if (err.response) throw err;
      const userStr = localStorage.getItem('homebite_user');
      return userStr ? JSON.parse(userStr) : null;
    }
  }
};

export const dishesApi = {
  getAll: async () => {
    try {
      const res = await api.get('/dishes');
      return res.data;
    } catch (err) {
      return getMockStorage('dishes', INITIAL_MOCK_DISHES);
    }
  },

  search: async (query = '', category = '') => {
    try {
      const res = await api.get('/dishes/search', { params: { query, category } });
      return res.data;
    } catch (err) {
      let list = getMockStorage('dishes', INITIAL_MOCK_DISHES);
      if (category && category !== 'ALL') {
        list = list.filter(d => d.category.toLowerCase() === category.toLowerCase());
      }
      if (query && query.trim()) {
        const q = query.toLowerCase();
        list = list.filter(d => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
      }
      return list;
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/dishes/${id}`);
      return res.data;
    } catch (err) {
      const list = getMockStorage('dishes', INITIAL_MOCK_DISHES);
      return list.find(d => Number(d.id) === Number(id)) || list[0];
    }
  },

  create: async (data) => {
    try {
      const res = await api.post('/dishes', data);
      return res.data;
    } catch (err) {
      const list = getMockStorage('dishes', INITIAL_MOCK_DISHES);
      const newDish = {
        ...data,
        id: Date.now(),
        cookId: 1,
        cookName: 'Maria Rossi',
        kitchenName: "Nonna's Hearth & Pasta",
        averageRating: 5.0,
        reviewCount: 0,
        createdAt: new Date().toISOString()
      };
      setMockStorage('dishes', [newDish, ...list]);
      return newDish;
    }
  },

  update: async (id, data) => {
    try {
      const res = await api.put(`/dishes/${id}`, data);
      return res.data;
    } catch (err) {
      const list = getMockStorage('dishes', INITIAL_MOCK_DISHES);
      const updated = list.map(d => Number(d.id) === Number(id) ? { ...d, ...data } : d);
      setMockStorage('dishes', updated);
      return updated.find(d => Number(d.id) === Number(id));
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/dishes/${id}`);
    } catch (err) {
      const list = getMockStorage('dishes', INITIAL_MOCK_DISHES);
      setMockStorage('dishes', list.filter(d => Number(d.id) !== Number(id)));
    }
  }
};

export const cooksApi = {
  getAll: async () => {
    try {
      const res = await api.get('/cooks');
      return res.data;
    } catch (err) {
      return getMockStorage('cooks', INITIAL_MOCK_COOKS);
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/cooks/${id}`);
      return res.data;
    } catch (err) {
      const list = getMockStorage('cooks', INITIAL_MOCK_COOKS);
      return list.find(c => Number(c.id) === Number(id)) || list[0];
    }
  },

  getDishes: async (cookId) => {
    try {
      const res = await api.get(`/cooks/${cookId}/dishes`);
      return res.data;
    } catch (err) {
      const list = getMockStorage('dishes', INITIAL_MOCK_DISHES);
      return list.filter(d => Number(d.cookId) === Number(cookId));
    }
  }
};

export const cartApi = {
  get: async () => {
    try {
      const res = await api.get('/cart');
      return res.data;
    } catch (err) {
      return getMockStorage('cart', {
        id: 1,
        items: [],
        subtotal: 0,
        deliveryFee: 3.99,
        total: 3.99,
        totalItems: 0
      });
    }
  },

  addItem: async (itemData) => {
    try {
      const res = await api.post('/cart/items', itemData);
      return res.data;
    } catch (err) {
      const cart = getMockStorage('cart', { id: 1, items: [], subtotal: 0, deliveryFee: 3.99, total: 3.99, totalItems: 0 });
      const dishes = getMockStorage('dishes', INITIAL_MOCK_DISHES);
      const dish = dishes.find(d => Number(d.id) === Number(itemData.dishId)) || dishes[0];

      const existingIndex = cart.items.findIndex(i => Number(i.dishId) === Number(dish.id));
      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += itemData.quantity || 1;
        cart.items[existingIndex].subtotal = cart.items[existingIndex].quantity * dish.price;
      } else {
        cart.items.push({
          id: Date.now(),
          dishId: dish.id,
          dishName: dish.name,
          imageUrl: dish.imageUrl,
          unitPrice: dish.price,
          quantity: itemData.quantity || 1,
          subtotal: (itemData.quantity || 1) * dish.price,
          cookId: dish.cookId,
          kitchenName: dish.kitchenName
        });
      }

      const subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
      const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      cart.subtotal = Math.round(subtotal * 100) / 100;
      cart.totalItems = totalItems;
      cart.deliveryFee = totalItems > 0 ? 3.99 : 0;
      cart.total = Math.round((cart.subtotal + cart.deliveryFee) * 100) / 100;

      setMockStorage('cart', cart);
      return cart;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/items/${itemId}`, { quantity });
      return res.data;
    } catch (err) {
      const cart = getMockStorage('cart', { id: 1, items: [], subtotal: 0, deliveryFee: 3.99, total: 3.99, totalItems: 0 });
      if (quantity <= 0) {
        cart.items = cart.items.filter(i => Number(i.id) !== Number(itemId));
      } else {
        const item = cart.items.find(i => Number(i.id) === Number(itemId));
        if (item) {
          item.quantity = quantity;
          item.subtotal = item.quantity * item.unitPrice;
        }
      }
      const subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
      const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      cart.subtotal = Math.round(subtotal * 100) / 100;
      cart.totalItems = totalItems;
      cart.deliveryFee = totalItems > 0 ? 3.99 : 0;
      cart.total = Math.round((cart.subtotal + cart.deliveryFee) * 100) / 100;
      setMockStorage('cart', cart);
      return cart;
    }
  },

  removeItem: async (itemId) => {
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      return res.data;
    } catch (err) {
      const cart = getMockStorage('cart', { id: 1, items: [], subtotal: 0, deliveryFee: 3.99, total: 3.99, totalItems: 0 });
      cart.items = cart.items.filter(i => Number(i.id) !== Number(itemId));
      const subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
      const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      cart.subtotal = Math.round(subtotal * 100) / 100;
      cart.totalItems = totalItems;
      cart.deliveryFee = totalItems > 0 ? 3.99 : 0;
      cart.total = Math.round((cart.subtotal + cart.deliveryFee) * 100) / 100;
      setMockStorage('cart', cart);
      return cart;
    }
  }
};

export const ordersApi = {
  create: async (data) => {
    try {
      const res = await api.post('/orders', data);
      return res.data;
    } catch (err) {
      const cart = getMockStorage('cart', { items: [], subtotal: 0 });
      const orders = getMockStorage('orders', []);
      const newOrder = {
        id: 1000 + orders.length + 1,
        customerId: 101,
        customerName: 'Emily Watson',
        kitchenName: cart.items[0]?.kitchenName || "Nonna's Hearth & Pasta",
        cookId: cart.items[0]?.cookId || 1,
        status: 'PENDING',
        totalAmount: cart.total || 20.49,
        deliveryFee: cart.deliveryFee || 3.99,
        deliveryAddress: data.deliveryAddress,
        customerPhone: data.customerPhone,
        specialNotes: data.specialNotes,
        items: cart.items.map(i => ({
          id: Date.now() + Math.random(),
          dishId: i.dishId,
          dishName: i.dishName,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          subtotal: i.subtotal
        })),
        createdAt: new Date().toISOString()
      };
      setMockStorage('orders', [newOrder, ...orders]);
      // Reset cart
      setMockStorage('cart', { id: 1, items: [], subtotal: 0, deliveryFee: 0, total: 0, totalItems: 0 });
      return newOrder;
    }
  },

  getMyOrders: async () => {
    try {
      const res = await api.get('/orders/my');
      return res.data;
    } catch (err) {
      return getMockStorage('orders', [
        {
          id: 1001,
          customerName: 'Emily Watson',
          kitchenName: "Nonna's Hearth & Pasta",
          status: 'DELIVERED',
          totalAmount: 20.49,
          deliveryFee: 3.99,
          deliveryAddress: '742 Evergreen Terrace, Springfield, IL',
          customerPhone: '+1 (555) 456-7890',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          items: [
            { id: 1, dishName: 'Slow-Baked Ragu Lasagna', unitPrice: 16.50, quantity: 1, subtotal: 16.50 }
          ]
        }
      ]);
    }
  },

  getCookOrders: async () => {
    try {
      const res = await api.get('/cook/orders');
      return res.data;
    } catch (err) {
      return getMockStorage('orders', [
        {
          id: 1001,
          customerName: 'Emily Watson',
          kitchenName: "Nonna's Hearth & Pasta",
          status: 'PREPARING',
          totalAmount: 20.49,
          deliveryFee: 3.99,
          deliveryAddress: '742 Evergreen Terrace, Springfield, IL',
          customerPhone: '+1 (555) 456-7890',
          createdAt: new Date().toISOString(),
          items: [
            { id: 1, dishName: 'Slow-Baked Ragu Lasagna', unitPrice: 16.50, quantity: 1, subtotal: 16.50 }
          ]
        }
      ]);
    }
  },

  getOrderById: async (id) => {
    try {
      const res = await api.get(`/orders/${id}`);
      return res.data;
    } catch (err) {
      const orders = getMockStorage('orders', []);
      return orders.find(o => Number(o.id) === Number(id)) || orders[0];
    }
  },

  updateStatus: async (id, status) => {
    try {
      const res = await api.patch(`/orders/${id}/status`, { status });
      return res.data;
    } catch (err) {
      const orders = getMockStorage('orders', []);
      const updated = orders.map(o => Number(o.id) === Number(id) ? { ...o, status } : o);
      setMockStorage('orders', updated);
      return updated.find(o => Number(o.id) === Number(id));
    }
  }
};

export const reviewsApi = {
  getByDishId: async (dishId) => {
    try {
      const res = await api.get(`/dishes/${dishId}/reviews`);
      return res.data;
    } catch (err) {
      const reviews = getMockStorage('reviews', [
        {
          id: 1,
          dishId: 1,
          dishName: 'Slow-Baked Ragu Lasagna',
          customerName: 'Emily Watson',
          rating: 5,
          comment: 'Without exaggeration, the best lasagna I have eaten in years. Tasted just like my grandmother used to bake on Sundays!',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: 2,
          dishId: 3,
          dishName: 'Heritage Butter Chicken & Naan',
          customerName: 'Marcus Cole',
          rating: 5,
          comment: 'The butter chicken was extraordinarily rich and delicately spiced. The garlic naan arrived warm and soft.',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
        }
      ]);
      return reviews.filter(r => Number(r.dishId) === Number(dishId));
    }
  },

  addReview: async (dishId, data) => {
    try {
      const res = await api.post(`/dishes/${dishId}/reviews`, data);
      return res.data;
    } catch (err) {
      const reviews = getMockStorage('reviews', []);
      const newReview = {
        id: Date.now(),
        dishId: Number(dishId),
        dishName: 'Homemade Specialty',
        customerName: 'Emily Watson',
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date().toISOString()
      };
      setMockStorage('reviews', [newReview, ...reviews]);
      return newReview;
    }
  }
};

export const adminApi = {
  getDashboard: async () => {
    try {
      const res = await api.get('/admin/dashboard');
      return res.data;
    } catch (err) {
      return {
        totalUsers: 148,
        totalCustomers: 112,
        totalCooks: 36,
        totalDishes: 84,
        totalOrders: 312,
        totalRevenue: 5840.50,
        pendingOrders: 7
      };
    }
  },

  getUsers: async () => {
    try {
      const res = await api.get('/admin/users');
      return res.data;
    } catch (err) {
      return [
        { id: 1, email: 'admin@homebite.com', fullName: 'Admin Supervisor', role: 'ADMIN', createdAt: '2026-01-10T10:00:00' },
        { id: 2, email: 'maria@homebite.com', fullName: 'Maria Rossi', role: 'COOK', createdAt: '2026-02-15T12:00:00' },
        { id: 3, email: 'raj@homebite.com', fullName: 'Rajesh Sharma', role: 'COOK', createdAt: '2026-02-20T15:30:00' },
        { id: 4, email: 'emily@homebite.com', fullName: 'Emily Watson', role: 'CUSTOMER', createdAt: '2026-03-01T09:15:00' }
      ];
    }
  },

  getOrders: async () => {
    try {
      const res = await api.get('/admin/orders');
      return res.data;
    } catch (err) {
      return getMockStorage('orders', []);
    }
  },

  getDishes: async () => {
    try {
      const res = await api.get('/admin/dishes');
      return res.data;
    } catch (err) {
      return getMockStorage('dishes', INITIAL_MOCK_DISHES);
    }
  }
};

export default api;
