import useStudioStore from '../store/studioStore';

function VirtualStudioPage() {
  const canvasItems = useStudioStore((state) => state.canvasItems);

  return (
    <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="display-font text-4xl font-bold text-slate-950">Virtual Studio</h1>
          <p className="mt-3 text-slate-600">Visualize your curated selections together in one space.</p>
        </div>
        
        <div className="mesh-card rounded-[2rem] p-8 min-h-[600px] relative bg-white/50 backdrop-blur-sm border border-white/40 shadow-xl overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)]">
          {canvasItems.length === 0 ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-slate-400">
              <span className="text-6xl mb-4 opacity-50">✨</span>
              <p className="text-lg font-medium">Your studio canvas is empty.</p>
              <p className="max-w-xs text-center text-sm mt-2">Add items from the catalog to see them assembled here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative">
              {canvasItems.map((item) => (
                <div key={item.id} className="glass-panel p-4 rounded-2xl flex flex-col items-center shadow-lg transition-transform hover:-translate-y-1 bg-white">
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 mb-4 border border-slate-100 flex items-center justify-center">
                    <img 
                      src={item.image_url || '/placeholder.png'} 
                      alt={item.prod_name || item.PROD_NAME} 
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-center text-sm">
                    {item.prod_name || item.PROD_NAME}
                  </h3>
                  <p className="text-indigo-600 font-bold mt-1 text-sm">
                    ${item.current_price || item.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VirtualStudioPage;
