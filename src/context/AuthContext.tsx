import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'Owner' | 'Employee';

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  gender?: string;
}

const DEFAULT_EMPLOYEES: User[] = [
  {
    id: '1',
    name: 'Sophia Miller',
    email: 'e1',
    role: 'Employee',
    avatar: '',
    gender: 'Female'
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'e2',
    role: 'Employee',
    avatar: '',
    gender: 'Female'
  },
  {
    id: '3',
    name: 'James Carter',
    email: 'e3',
    role: 'Employee',
    avatar: '',
    gender: 'Male'
  },
  {
    id: '4',
    name: 'Mia Thompson',
    email: 'e4',
    role: 'Employee',
    avatar: '',
    gender: 'Female'
  },
  {
    id: '5',
    name: 'Isabella Ross',
    email: 'e5',
    role: 'Employee',
    avatar: '',
    gender: 'Female'
  },
  {
    id: '6',
    name: 'Olivia Garcia',
    email: 'e6',
    role: 'Employee',
    avatar: '',
    gender: 'Female'
  },
];

interface AuthContextData {
  user: User | null;
  employees: User[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  signOut: () => Promise<void>;
  addEmployee: (name: string, email: string, password: string, gender: string, avatar?: string) => Promise<void>;
  updateEmployee: (id: string | number, updates: Partial<User>) => Promise<void>;
  updateEmployeeProfile: (name: string, avatar: string, id?: string) => Promise<void>;
  removeEmployee: (id: string | number) => Promise<void>;
  fetchEmployees: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = React.useCallback(async () => {
    try {
      const response = await fetch('https://untrumpeted-sallie-shallowly.ngrok-free.dev/salon_app/view-staff/', {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const staffList = Array.isArray(data) ? data : (data ? [data] : []);
        
        if (staffList.length > 0) {
          const fetchedEmployees = staffList.map((s: any) => ({
            id: s.id, // Keep as numeric if it is numeric
            name: s.name || s.username || s.email || 'Unnamed Employee',
            email: s.email || '',
            role: 'Employee' as UserRole,
            gender: s.gender || 'Male',
            avatar: s.avatar || '',
            password: s.password || ''
          }));
          setEmployees(fetchedEmployees);
          await AsyncStorage.setItem('@SalonApp:employees', JSON.stringify(fetchedEmployees));
        }
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    }
  }, []);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@SalonApp:user');
      const storageEmployees = await AsyncStorage.getItem('@SalonApp:employees');

      if (storageUser) {
        const parsedUser = JSON.parse(storageUser);
        setUser(parsedUser);
        
        // If owner is logged in, sync the staff list from backend
        if (parsedUser.role === 'Owner') {
          fetchEmployees();
        }
      }

      if (storageEmployees) {
        setEmployees(JSON.parse(storageEmployees));
      } else {
        // Seed default employees for the walkthrough
        setEmployees(DEFAULT_EMPLOYEES);
        await AsyncStorage.setItem('@SalonApp:employees', JSON.stringify(DEFAULT_EMPLOYEES));
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(email: string, password: string): Promise<boolean> {
    try {
      const allUsersStr = await AsyncStorage.getItem('@SalonApp:all_users');
      const allUsers: User[] = allUsersStr ? JSON.parse(allUsersStr) : [];

      const foundUser = allUsers.find(u => u.email === email && u.password === password);

      if (foundUser) {
        const correctPassword = foundUser.password;
        console.log('DEBUG: Attempting login for', foundUser.name);
        console.log('DEBUG: Input Password:', password);
        console.log('DEBUG: Correct Password:', correctPassword);
        
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
        await AsyncStorage.setItem('@SalonApp:user', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function signUp(name: string, email: string, password: string, role: UserRole): Promise<boolean> {
    try {
      const allUsersStr = await AsyncStorage.getItem('@SalonApp:all_users');
      const allUsers: User[] = allUsersStr ? JSON.parse(allUsersStr) : [];

      if (allUsers.find(u => u.email === email)) {
        return false;
      }

      const newUser: User = { id: Math.random().toString(36).substr(2, 9), name, email, password, role };
      const updatedUsers = [...allUsers, newUser];

      await AsyncStorage.setItem('@SalonApp:all_users', JSON.stringify(updatedUsers));

      if (role === 'Employee') {
        const updatedEmployees = [newUser, ...employees];
        setEmployees(updatedEmployees);
        await AsyncStorage.setItem('@SalonApp:employees', JSON.stringify(updatedEmployees));
      }

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword as User);
      await AsyncStorage.setItem('@SalonApp:user', JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function addEmployee(name: string, email: string, password: string, gender: string, avatar?: string): Promise<void> {
    try {
      // 1. Sync with backend
      const response = await fetch('https://untrumpeted-sallie-shallowly.ngrok-free.dev/salon_app/add-staff/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          gender,
          avatar: avatar || '',
          role: 'Employee'
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Use backend response directly as requested
        const newEmployee: User = {
          ...data,
          name: data.name || data.username || name || 'Unnamed Employee',
          email: data.email || email,
          password: data.password || password,
          role: 'Employee',
          avatar: data.avatar || avatar || ''
        };
        
        console.log('DEBUG: New employee created with password:', newEmployee.password);
        
        const updatedEmployees = [...employees, newEmployee];
        setEmployees(updatedEmployees);
        await AsyncStorage.setItem('@SalonApp:employees', JSON.stringify(updatedEmployees));
      } else {
        const errorData = await response.json();
        console.error('Backend staff sync failed:', errorData);
        throw new Error(errorData.message || 'Failed to add staff to backend');
      }
    } catch (error) {
      console.error('Add Employee Error:', error);
      throw error; // Propagate error to UI
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem('@SalonApp:user');
    setUser(null);
  }

  async function updateEmployee(id: string | number, updates: Partial<User>): Promise<void> {
    try {
      // 1. Update the current user session if it's the target
      if (user && user.id === id) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        await AsyncStorage.setItem('@SalonApp:user', JSON.stringify(updatedUser));
      }

      // 2. Update in all users list
      const allUsersStr = await AsyncStorage.getItem('@SalonApp:all_users');
      if (allUsersStr) {
        const allUsers: User[] = JSON.parse(allUsersStr);
        const updatedAllUsers = allUsers.map(u =>
          u.id === id ? { ...u, ...updates } : u
        );
        await AsyncStorage.setItem('@SalonApp:all_users', JSON.stringify(updatedAllUsers));
      }

      // 3. Update in employees list
      const updatedEmployees = employees.map(emp =>
        emp.id === id ? { ...emp, ...updates } : emp
      );
      setEmployees(updatedEmployees);
      await AsyncStorage.setItem('@SalonApp:employees', JSON.stringify(updatedEmployees));
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  }

  async function updateEmployeeProfile(name: string, avatar: string, id?: string): Promise<void> {
    const targetId = id || user?.id;
    if (!targetId) return;
    await updateEmployee(targetId, { name, avatar });
  }

  async function removeEmployee(id: string | number): Promise<void> {
    try {
      console.log("Deleting staff id:", id);
      if (!id) return;

      const numericId = typeof id === 'number' ? id : parseInt(id, 10);
      
      if (!isNaN(numericId)) {
        // 0. Sync with backend
        try {
          const response = await fetch(
            'https://untrumpeted-sallie-shallowly.ngrok-free.dev/salon_app/delete-staff/',
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
              },
              body: JSON.stringify({
                id: numericId
              })
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Delete failed:", errorData);
          }
        } catch (netError) {
          console.error("Failed to delete staff from backend:", netError);
        }
      } else {
        console.log("Legacy or non-numeric ID detected, skipping backend delete:", id);
      }

      // 1. Update in employees list
      const updatedEmployees = employees.filter(emp => emp.id !== id);
      setEmployees(updatedEmployees);
      await AsyncStorage.setItem('@SalonApp:employees', JSON.stringify(updatedEmployees));

      // 2. Update in all users list (so they can no longer log in)
      const allUsersStr = await AsyncStorage.getItem('@SalonApp:all_users');
      if (allUsersStr) {
        const allUsers: User[] = JSON.parse(allUsersStr);
        const updatedAllUsers = allUsers.filter(u => u.id !== id);
        await AsyncStorage.setItem('@SalonApp:all_users', JSON.stringify(updatedAllUsers));
      }
    } catch (error) {
      console.error('Failed to remove employee:', error);
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      employees,
      loading,
      signIn,
      signUp,
      signOut,
      addEmployee,
      updateEmployee,
      updateEmployeeProfile,
      removeEmployee,
      fetchEmployees
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
