import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Category = 'Dairy' | 'Meat/Seafood' | 'Produce' | 'Bakery' | 'Pantry' | 'Frozen' | 'Leftovers' | 'Drinks' | 'Snacks' | 'Other';
export type StorageLocation = 'Fridge' | 'Pantry' | 'Freezer';

export interface ShelfItem {
  id: string;
  name: string;
  category: Category;
  storage: StorageLocation;
  addedDate: string;
  expiryDate: string;
  discardReason?: string;
  status: 'active' | 'consumed' | 'discarded';
}

export interface UserSettings {
  setupComplete: boolean;
  reminderTime: string;
  quietHoursStart: string;
  quietHoursEnd: string;
  notificationStyle: 'digest' | 'all';
}

interface SmartShelfState {
  items: ShelfItem[];
  settings: UserSettings;
  addItem: (item: Omit<ShelfItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<ShelfItem>) => void;
  removeItem: (id: string) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  markAsConsumed: (id: string) => void;
  markAsDiscarded: (id: string, reason?: string) => void;
  freezeItem: (id: string) => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  setupComplete: false,
  reminderTime: '18:00',
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  notificationStyle: 'digest',
};

const SEED_ITEMS: ShelfItem[] = [
  { id: '1', name: 'Milk', category: 'Dairy', storage: 'Fridge', addedDate: new Date().toISOString(), expiryDate: new Date(Date.now() + 5 * 86400000).toISOString(), status: 'active' },
  { id: '2', name: 'Eggs', category: 'Dairy', storage: 'Fridge', addedDate: new Date().toISOString(), expiryDate: new Date(Date.now() + 21 * 86400000).toISOString(), status: 'active' },
  { id: '3', name: 'Spinach', category: 'Produce', storage: 'Fridge', addedDate: new Date().toISOString(), expiryDate: new Date(Date.now() + 2 * 86400000).toISOString(), status: 'active' },
  { id: '4', name: 'Chicken breast', category: 'Meat/Seafood', storage: 'Fridge', addedDate: new Date().toISOString(), expiryDate: new Date(Date.now() + 1 * 86400000).toISOString(), status: 'active' },
  { id: '5', name: 'Leftover pasta', category: 'Leftovers', storage: 'Fridge', addedDate: new Date().toISOString(), expiryDate: new Date(Date.now() + 0.5 * 86400000).toISOString(), status: 'active' },
  { id: '6', name: 'Bread', category: 'Bakery', storage: 'Pantry', addedDate: new Date().toISOString(), expiryDate: new Date(Date.now() + 4 * 86400000).toISOString(), status: 'active' },
];

export const useSmartShelfStore = create<SmartShelfState>()(
  persist(
    (set) => ({
      items: SEED_ITEMS,
      settings: DEFAULT_SETTINGS,
      addItem: (item) => set((state) => ({
        items: [{ ...item, id: Math.random().toString(36).substr(2, 9) }, ...state.items]
      })),
      updateItem: (id, updates) => set((state) => ({
        items: state.items.map((item) => item.id === id ? { ...item, ...updates } : item)
      })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
      markAsConsumed: (id) => set((state) => ({
        items: state.items.map((item) => item.id === id ? { ...item, status: 'consumed' } : item)
      })),
      markAsDiscarded: (id, reason) => set((state) => ({
        items: state.items.map((item) => item.id === id ? { ...item, status: 'discarded', discardReason: reason } : item)
      })),
      freezeItem: (id) => set((state) => ({
        items: state.items.map((item) => {
          if (item.id === id) {
            const currentExpiry = new Date(item.expiryDate);
            // Extend shelf life by 3 months if frozen
            currentExpiry.setMonth(currentExpiry.getMonth() + 3);
            return { ...item, storage: 'Freezer', expiryDate: currentExpiry.toISOString() };
          }
          return item;
        })
      })),
    }),
    {
      name: 'smart-shelf-storage',
    }
  )
);