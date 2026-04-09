import { create } from 'zustand';
import api from '../api/axiosConfig';

const useProductStore = create((set) => ({
  vendorProducts: [],
  loading: false,

  fetchVendorProducts: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/products/vendor');
      set({ vendorProducts: data });
    } catch (error) {
      console.error('Fetch vendor products error', error);
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (productData) => {
    try {
      await api.post('/products', productData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create product' };
    }
  },

  updateProduct: async (id, productData) => {
    try {
      await api.put(`/products/${id}`, productData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update product' };
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      set((state) => ({
        vendorProducts: state.vendorProducts.filter((p) => p.prod_id !== id),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete product' };
    }
  },
}));

export default useProductStore;
