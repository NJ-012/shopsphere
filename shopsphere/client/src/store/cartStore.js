import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (item) => item.prod_id === product.prod_id && item.variant_id === (product.variant_id || null)
        );
        if (existingIndex >= 0) {
          const updatedItems = [...items];
          const item = updatedItems[existingIndex];
          if (item.quantity < item.stock_qty) {
            updatedItems[existingIndex] = { ...item, quantity: item.quantity + 1 };
            set({ items: updatedItems });
          }
        } else {
          set({
            items: [
              ...items,
              { 
                ...product,
                quantity: 1,
                variant_label: product.variant_label || ''
              }
            ],
          });
        }
      },
      removeItem: (prod_id, variant_id) => set({
        items: get().items.filter(
          (item) => !(item.prod_id === prod_id && item.variant_id === variant_id)
        ),
      }),
      updateQuantity: (prod_id, variant_id, qty) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (item) => item.prod_id === prod_id && item.variant_id === variant_id
        );
        if (existingIndex >= 0) {
          const updatedItems = [...items];
          if (qty < 1) {
            updatedItems.splice(existingIndex, 1);
          } else if (qty <= updatedItems[existingIndex].stock_qty) {
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: qty,
            };
          }
          set({ items: updatedItems });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;

