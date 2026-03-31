import { create } from 'zustand';

const useStudioStore = create((set, get) => ({
  activeModel: null,
  userPhoto: null,
  backgroundMode: 'model',
  canvasItems: [],
  selectedItemId: null,
  isSaving: false,
  setActiveModel: (model) => set({ 
    activeModel: model, 
    backgroundMode: 'model',
    userPhoto: null 
  }),
  setUserPhoto: (dataUrl) => set({ 
    userPhoto: dataUrl, 
    backgroundMode: 'personal',
    activeModel: null 
  }),
  clearBackground: () => set({ 
    activeModel: null, 
    userPhoto: null, 
    backgroundMode: 'model' 
  }),
  addItem: (product) => {
    const { canvasItems } = get();
    if (canvasItems.some(item => item.prod_id === product.prod_id)) {
      return false;
    }
    const newItem = {
      id: Date.now() + Math.random(),
      ...product,
      pos_x: 50,
      pos_y: 35,
      scale: 1,
      rotation: 0,
      isSelected: false,
      isHidden: false,
    };
    let updatedItems = [...canvasItems, newItem];
    // Sort by layer_order
    updatedItems.sort((a, b) => (a.layer_order || 0) - (b.layer_order || 0));
    set({ canvasItems: updatedItems });
    return true;
  },
  removeItem: (id) => set({
    canvasItems: get().canvasItems.filter(item => item.id !== id),
    selectedItemId: null,
  }),
  updateItemTransform: (id, changes) => set({
    canvasItems: get().canvasItems.map(item => 
      item.id === id ? { ...item, ...changes } : item
    ),
  }),
  selectItem: (id) => set({
    canvasItems: get().canvasItems.map(item => ({
      ...item,
      isSelected: item.id === id,
    })),
    selectedItemId: id,
  }),
  deselectAll: () => set({
    canvasItems: get().canvasItems.map(item => ({ ...item, isSelected: false })),
    selectedItemId: null,
  }),
  reorderLayer: (id, dir) => {
    const { canvasItems } = get();
    const itemIndex = canvasItems.findIndex(item => item.id === id);
    if (itemIndex === -1) return;
    
    const newLayerOrder = (canvasItems[itemIndex].layer_order || itemIndex) + (dir === 'up' ? -1 : 1);
    
    let updatedItems = canvasItems.map(item => {
      if (item.id === id) {
        return { ...item, layer_order: newLayerOrder };
      }
      return item;
    });
    
    // Re-sort by layer_order
    updatedItems.sort((a, b) => (a.layer_order || 0) - (b.layer_order || 0));
    set({ canvasItems: updatedItems });
  },
  clearCanvas: () => set({ 
    canvasItems: [], 
    selectedItemId: null 
  }),
  setSaving: (isSaving) => set({ isSaving }),
}));

export default useStudioStore;

