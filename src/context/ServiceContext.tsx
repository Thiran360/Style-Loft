import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  description?: string;
  isLocal?: boolean;
}

export interface Category {
  id: number;
  name: string;
  image?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  isVisible: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  serviceName: string;
  totalAmount: string;
  customerPhone: string;
  persons: number;
  serviceId?: string;
  date: string;
}

interface ServiceContextData {
  services: Service[];
  categories: Category[];
  coupons: Coupon[];
  orders: Order[];
  loading: boolean;
  updateServicePrice: (serviceId: string, newPrice: string) => Promise<void>;
  updateServiceImage: (serviceId: string, newImage: string) => Promise<void>;
  resetServices: () => Promise<void>;
  addCoupon: (code: string, discount: number) => Promise<void>;
  removeCoupon: (couponId: string) => Promise<void>;
  toggleCouponVisibility: (couponId: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => Promise<Order>;
  removeOrder: (orderId: string) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  removeService: (serviceId: string) => Promise<void>;
}

const INITIAL_SERVICES: Service[] = [
  // Men's Haircuts
  { id: '1', name: 'Classic Fade', category: 'Men', price: '₹450', image: 'https://images.unsplash.com/photo-1622286332616-f319b6997bd4?w=800' },
  { id: '2', name: 'Textured Quiff', category: 'Men', price: '₹550', image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800' },
  { id: '3', name: 'Buzz Cut', category: 'Men', price: '₹350', image: 'https://images.unsplash.com/photo-1593702288069-b35e141f1b3f?w=800' },
  { id: '4', name: 'Pompadour', category: 'Men', price: '₹600', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800' },
  { id: '5', name: 'Beard Grooming', category: 'Men', price: '₹300', image: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=800' },
  { id: '6', name: 'Modern Mullet', category: 'Men', price: '₹650', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800' },
  { id: '7', name: 'French Crop', category: 'Men', price: '₹500', image: 'https://images.unsplash.com/photo-1590540179852-2110a54f813a?w=800' },
  { id: '8', name: 'Long Flow', category: 'Men', price: '₹550', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800' },
  { id: '9', name: 'Side Part', category: 'Men', price: '₹450', image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800' },
  { id: '10', name: 'Head Shave', category: 'Men', price: '₹400', image: 'https://images.unsplash.com/photo-1592647420148-bfcc1a3ed291?w=800' },

  // Women's services
  { id: '11', name: 'Layered Cut', category: 'Women', price: '₹1200', image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800' },
  { id: '12', name: 'Bob Cut', category: 'Women', price: '₹950', image: 'https://images.unsplash.com/photo-1516912403163-54cdcca987ad?w=800' },
  { id: '13', name: 'Hair Coloring', category: 'Women', price: '₹2500', image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800' },
  { id: '14', name: 'Highlights', category: 'Women', price: '₹3500', image: 'https://images.unsplash.com/photo-1563178406-4dc29323db3a?w=800' },
  { id: '15', name: 'Keratin Treatment', category: 'Women', price: '₹5000', image: 'https://images.unsplash.com/photo-1522337360744-47309daa4001?w=800' },
  { id: '16', name: 'Pixie Cut', category: 'Women', price: '₹1100', image: 'https://images.unsplash.com/photo-1552046122-03184de85e08?w=800' },
  { id: '17', name: 'Deep Conditioning', category: 'Women', price: '₹1500', image: 'https://images.unsplash.com/photo-1527799822394-d42129e925b4?w=800' },
  { id: '18', name: 'Balayage', category: 'Women', price: '₹4500', image: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=800' },
  { id: '19', name: 'Perms', category: 'Women', price: '₹3000', image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800' },
  { id: '20', name: 'Bridal Styling', category: 'Women', price: '₹8000', image: 'https://images.unsplash.com/photo-1549444358-953880911964?w=800' },

  // Kids' services
  { id: '21', name: 'Basic Trim', category: 'Kids', price: '₹250', image: 'https://images.unsplash.com/photo-1519341100147-380d774e1d5a?w=800' },
  { id: '22', name: 'Pattern Cut', category: 'Kids', price: '₹450', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800' },
  { id: '23', name: 'Styles for Boys', category: 'Kids', price: '₹350', image: 'https://images.unsplash.com/photo-1566411520896-01e7ca4726af?w=800' },
  { id: '24', name: 'Styles for Girls', category: 'Kids', price: '₹500', image: 'https://images.unsplash.com/photo-1518837691465-388299108c48?w=800' },
  { id: '25', name: 'Detangling Service', category: 'Kids', price: '₹400', image: 'https://images.unsplash.com/photo-1519457431-7e3e9700ced7?w=800' },
];

const DEFAULT_CATEGORIES: Category[] = [
  { 
    id: 1, 
    name: 'Men', 
    image: 'https://img77.uenicdn.com/image/upload/v1542042531/category/shutterstock_568819498.jpg' 
  },
  { 
    id: 2, 
    name: 'Women', 
    image: 'https://i.pinimg.com/736x/94/60/89/9460892564633e8956df77e03db7d24a.jpg' 
  },
  { 
    id: 3, 
    name: 'Kids', 
    image: 'https://media.istockphoto.com/id/648984076/photo/hairdresser-shears-scissors-boy-home.jpg?s=612x612&w=0&k=20&c=VAI7sXyttxbubUVOey7oCCWtRWcizxbSO2SJ5OG-b80=' 
  },
];

const ServiceContext = createContext<ServiceContextData>({} as ServiceContextData);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch('https://untrumpeted-sallie-shallowly.ngrok-free.dev/salon_app/services/', {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const fetchedServices = data.map((s: any) => ({
            id: s.id ? s.id.toString() : Math.random().toString(36).substr(2, 9),
            name: s.service_name || s.name || 'Unnamed Service',
            category: s.category || 'Uncategorized',
            price: s.price ? (s.price.toString().startsWith('₹') ? s.price : `₹${s.price}`) : '₹0',
            image: s.image || '',
            description: s.description || ''
          }));

          const storedServicesStr = await AsyncStorage.getItem('@SalonApp:services');
          let localServices: Service[] = [];
          if (storedServicesStr) {
            const parsed = JSON.parse(storedServicesStr);
            localServices = parsed.filter((s: Service) => s.isLocal);
          }

          const mergedServices = [...fetchedServices];
          for (const localSvc of [...localServices].reverse()) {
            const backendIndex = mergedServices.findIndex((fs: Service) => 
              (fs.name || '').toLowerCase() === (localSvc.name || '').toLowerCase()
            );
            if (backendIndex >= 0) {
              // Retain isLocal flag so it survives backend resets AND move to front
              const existingSvc = mergedServices.splice(backendIndex, 1)[0];
              existingSvc.isLocal = true;
              mergedServices.unshift(existingSvc);
            } else {
              // Restore it if backend dropped it, placing at front
              mergedServices.unshift(localSvc);
            }
          }

          setServices(mergedServices);
          await AsyncStorage.setItem('@SalonApp:services', JSON.stringify(mergedServices));
        }
      }
    } catch (error) {
      console.error('Failed to fetch services, using defaults:', error);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const storedServices = await AsyncStorage.getItem('@SalonApp:services');
        const storedCoupons = await AsyncStorage.getItem('@SalonApp:coupons');
        const storedOrders = await AsyncStorage.getItem('@SalonApp:orders');

        if (storedServices) {
          setServices(JSON.parse(storedServices));
        } else {
          setServices(INITIAL_SERVICES);
          await AsyncStorage.setItem('@SalonApp:services', JSON.stringify(INITIAL_SERVICES));
        }

        if (storedCoupons) {
          setCoupons(JSON.parse(storedCoupons));
        }

        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setServices(INITIAL_SERVICES);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const response = await fetch('https://untrumpeted-sallie-shallowly.ngrok-free.dev/salon_app/categories/', {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            // Add default images if not provided by backend
            const categoriesWithImages = data.map((cat: any) => ({
              ...cat,
              image: cat.image || (
                cat.name === 'Men' 
                  ? 'https://img77.uenicdn.com/image/upload/v1542042531/category/shutterstock_568819498.jpg'
                  : cat.name === 'Women'
                  ? 'https://i.pinimg.com/736x/94/60/89/9460892564633e8956df77e03db7d24a.jpg'
                  : 'https://media.istockphoto.com/id/648984076/photo/hairdresser-shears-scissors-boy-home.jpg?s=612x612&w=0&k=20&c=VAI7sXyttxbubUVOey7oCCWtRWcizxbSO2SJ5OG-b80='
              )
            }));
            setCategories(categoriesWithImages);
          }
        }
      } catch (error) {
        console.error('Failed to fetch categories, using defaults:', error);
        // categories already initialized to DEFAULT_CATEGORIES
      }
    }

    loadData();
    fetchCategories();
    fetchServices();
  }, [fetchServices]);

  async function updateServicePrice(serviceId: string, newPrice: string) {
    try {
      const updatedServices = services.map(service =>
        service.id === serviceId ? { ...service, price: newPrice } : service
      );
      setServices(updatedServices);
      await AsyncStorage.setItem('@SalonApp:services', JSON.stringify(updatedServices));
    } catch (error) {
      console.error('Failed to update service price:', error);
    }
  }

  async function updateServiceImage(serviceId: string, newImage: string) {
    try {
      const updatedServices = services.map(service =>
        service.id === serviceId ? { ...service, image: newImage } : service
      );
      setServices(updatedServices);
      await AsyncStorage.setItem('@SalonApp:services', JSON.stringify(updatedServices));
    } catch (error) {
      console.error('Failed to update service image:', error);
    }
  }

  async function resetServices() {
    try {
      setServices(INITIAL_SERVICES);
      await AsyncStorage.setItem('@SalonApp:services', JSON.stringify(INITIAL_SERVICES));
    } catch (error) {
      console.error('Failed to reset services:', error);
    }
  }

  async function addService(serviceData: Omit<Service, 'id'>) {
    try {
      // 1. Optimistically update local state so it appears immediately
      const newLocalId = Math.random().toString(36).substr(2, 9);
      const newService: Service = {
        ...serviceData,
        id: newLocalId,
        isLocal: true
      };
      
      // Read current storage to ensure we don't have stale state, then write and AWAIT it
      const storedServicesStr = await AsyncStorage.getItem('@SalonApp:services');
      const currentServices = storedServicesStr ? JSON.parse(storedServicesStr) : services;
      const updatedServices = [newService, ...currentServices];
      
      await AsyncStorage.setItem('@SalonApp:services', JSON.stringify(updatedServices));
      setServices(updatedServices);

      // 2. Sync with backend
      try {
        const response = await fetch('https://untrumpeted-sallie-shallowly.ngrok-free.dev/salon_app/add-service/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            name: serviceData.name,
            service_name: serviceData.name,
            category: serviceData.category,
            price: serviceData.price.replace('₹', ''),
            image: serviceData.image,
            description: serviceData.description || ''
          })
        });

        if (response.ok) {
          // Successfully added to backend. Re-fetch services to get real ID and avoid local state disappearing on refresh.
          await fetchServices();
          return;
        } else {
          console.warn('Service backend sync failed, proceeding with local backup.');
        }
      } catch (netError) {
        console.error('Network error during service sync:', netError);
      }
    } catch (error) {
      console.error('Failed to add service:', error);
    }
  }

  async function addCoupon(code: string, discount: number) {
    try {
      const newCoupon = {
        id: Math.random().toString(36).substr(2, 9),
        code: code.toUpperCase(),
        discountPercentage: discount,
        isVisible: true
      };
      const updatedCoupons = [...coupons, newCoupon];
      setCoupons(updatedCoupons);
      await AsyncStorage.setItem('@SalonApp:coupons', JSON.stringify(updatedCoupons));
    } catch (error) {
      console.error('Failed to add coupon:', error);
    }
  }

  async function toggleCouponVisibility(couponId: string) {
    try {
      const updatedCoupons = coupons.map(c => 
        c.id === couponId ? { ...c, isVisible: !c.isVisible } : c
      );
      setCoupons(updatedCoupons);
      await AsyncStorage.setItem('@SalonApp:coupons', JSON.stringify(updatedCoupons));
    } catch (error) {
      console.error('Failed to toggle coupon visibility:', error);
    }
  }

  async function removeCoupon(couponId: string) {
    try {
      const updatedCoupons = coupons.filter(c => c.id !== couponId);
      setCoupons(updatedCoupons);
      await AsyncStorage.setItem('@SalonApp:coupons', JSON.stringify(updatedCoupons));
    } catch (error) {
      console.error('Failed to remove coupon:', error);
    }
  }

  async function addOrder(orderData: Omit<Order, 'id' | 'date'>) {
    try {
      // 0. Generate ID and Date first
      let maxNum = 100;
      orders.forEach(o => {
        if (o.id.startsWith('SL-')) {
          const num = parseInt(o.id.replace('SL-', ''), 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      });
      const nextNum = maxNum + 1;
      const orderId = `SL-${nextNum}`;
      const orderDate = new Date().toLocaleString();

      // 1. Sync with backend
      try {
        const response = await fetch('https://untrumpeted-sallie-shallowly.ngrok-free.dev/salon_app/create-booking/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            customer_name: orderData.customerName,
            customer_phone: orderData.customerPhone,
            service_id: orderData.serviceId,
            total_amount: orderData.totalAmount.replace(/[^0-9.]/g, ''),
            persons: orderData.persons,
            order_id: orderId
          })
        });

        if (!response.ok) {
          console.warn('Booking backend sync failed, proceeding with local backup.');
        }
      } catch (netError) {
        console.error('Network error during booking sync:', netError);
      }

      // 2. Update local state and storage
      const newOrder: Order = {
        ...orderData,
        id: orderId,
        date: orderDate
      };
      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      await AsyncStorage.setItem('@SalonApp:orders', JSON.stringify(updatedOrders));
      return newOrder;
    } catch (error) {
      console.error('Failed to add order:', error);
      throw error;
    }
  }

  async function removeOrder(orderId: string) {
    try {
      // 1. Sync with backend
      try {
        const response = await fetch('https://untrumpeted-sallie-shallowly.ngrok-free.dev/salon_app/delete-booking/', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            order_id: orderId
          })
        });

        if (!response.ok) {
          console.warn('Booking deletion backend sync failed.');
        }
      } catch (netError) {
        console.error('Network error during booking deletion:', netError);
      }

      // 2. Update local state and storage
      const updatedOrders = orders.filter(o => o.id !== orderId);
      setOrders(updatedOrders);
      await AsyncStorage.setItem('@SalonApp:orders', JSON.stringify(updatedOrders));
    } catch (error) {
      console.error('Failed to remove order:', error);
    }
  }

  async function removeService(serviceId: string) {
    try {
      // 1. Sync with backend
      try {
        const response = await fetch('https://untrumpeted-sallie-shallowly.ngrok-free.dev/salon_app/delete-service/', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            service_id: serviceId
          })
        });

        if (!response.ok) {
          console.warn('Service deletion backend sync failed, proceeding with local backup.');
        }
      } catch (netError) {
        console.error('Network error during service deletion sync:', netError);
      }

      // 2. Update local state and storage
      const updatedServices = services.filter(s => s.id !== serviceId);
      setServices(updatedServices);
      await AsyncStorage.setItem('@SalonApp:services', JSON.stringify(updatedServices));
    } catch (error) {
      console.error('Failed to remove service:', error);
    }
  }

  return (
    <ServiceContext.Provider value={{
      services,
      categories,
      coupons,
      orders,
      loading,
      updateServicePrice,
      updateServiceImage,
      resetServices,
      addCoupon,
      removeCoupon,
      toggleCouponVisibility,
      addOrder,
      removeOrder,
      addService,
      removeService
    }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => useContext(ServiceContext);
