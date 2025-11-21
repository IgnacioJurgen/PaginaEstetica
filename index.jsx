import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  AlertTriangle, 
  Calendar, 
  Search, 
  Package, 
  TrendingDown, 
  TrendingUp,
  Filter,
  Droplet,
  LayoutDashboard,
  History
} from 'lucide-react';

// Datos iniciales de ejemplo
const INITIAL_DATA = [
  { id: 1, name: "Ácido Hialurónico 2ml", category: "Inyectables", stock: 5, minStock: 3, unit: "viales", expiry: "2025-06-15", lastUpdate: "2023-10-20" },
  { id: 2, name: "Toxina Botulínica Tipo A", category: "Inyectables", stock: 12, minStock: 5, unit: "unidades", expiry: "2024-01-10", lastUpdate: "2023-10-18" },
  { id: 3, name: "Crema Hidratante Facial Pro", category: "Cabina", stock: 2, minStock: 4, unit: "botes", expiry: "2024-12-01", lastUpdate: "2023-09-05" },
  { id: 4, name: "Gasas Estériles (Paquete)", category: "Descartables", stock: 45, minStock: 20, unit: "paquetes", expiry: "2026-01-01", lastUpdate: "2023-10-22" },
  { id: 5, name: "Mascarilla de Alginatos", category: "Cabina", stock: 8, minStock: 10, unit: "sobres", expiry: "2023-11-30", lastUpdate: "2023-10-15" },
];

const App = () => {
  const [products, setProducts] = useState(INITIAL_DATA);
  const [view, setView] = useState('inventory'); // 'inventory', 'add'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('expiry'); // 'expiry', 'stock', 'name'
  const [sortOrder, setSortOrder] = useState('asc');

  // Estado para el formulario de nuevo producto
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Cabina',
    stock: 0,
    minStock: 5,
    unit: 'unidades',
    expiry: ''
  });

  // Lógica de ordenamiento
  const sortedProducts = [...products].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'expiry') {
      comparison = new Date(a.expiry) - new Date(b.expiry);
    } else if (sortBy === 'stock') {
      comparison = a.stock - b.stock;
    } else {
      comparison = a.name.localeCompare(b.name);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Filtrado por búsqueda
  const filteredProducts = sortedProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Verificar estados de alerta
  const getExpiryStatus = (dateString) => {
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { color: 'bg-red-100 text-red-800 border-red-200', text: 'Vencido', icon: AlertTriangle };
    if (diffDays < 30) return { color: 'bg-orange-100 text-orange-800 border-orange-200', text: `${diffDays} días`, icon: AlertTriangle };
    return { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'Vigente', icon: Calendar };
  };

  const getStockStatus = (current, min) => {
    if (current === 0) return { color: 'text-red-600 bg-red-50', label: 'Sin Stock' };
    if (current <= min) return { color: 'text-orange-600 bg-orange-50', label: 'Bajo' };
    return { color: 'text-emerald-600 bg-emerald-50', label: 'Ok' };
  };

  // Manejadores de acciones
  const handleUpdateStock = (id, amount) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + amount);
        return { ...p, stock: newStock, lastUpdate: new Date().toISOString().split('T')[0] };
      }
      return p;
    }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = {
      ...newProduct,
      id: Date.now(),
      lastUpdate: new Date().toISOString().split('T')[0]
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', category: 'Cabina', stock: 0, minStock: 5, unit: 'unidades', expiry: '' });
    setView('inventory');
  };

  // Componentes UI
  const Card = ({ title, value, icon: Icon, colorClass, subtext }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-rose-500 p-2 rounded-lg text-white">
              <Droplet size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">EstéticaFlow <span className="text-rose-500">Control</span></h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setView('inventory')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'inventory' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Inventario
            </button>
            <button 
              onClick={() => setView('add')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'add' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              <Plus size={16} /> Nuevo Artículo
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        
        {/* Dashboard Stats */}
        {view === 'inventory' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card 
              title="Total Productos" 
              value={products.length} 
              icon={Package} 
              colorClass="bg-blue-50 text-blue-600" 
            />
            <Card 
              title="Stock Crítico" 
              value={products.filter(p => p.stock <= p.minStock).length} 
              subtext="Artículos por debajo del mínimo"
              icon={TrendingDown} 
              colorClass="bg-orange-50 text-orange-600" 
            />
            <Card 
              title="Alertas Vencimiento" 
              value={products.filter(p => getExpiryStatus(p.expiry).color.includes('red') || getExpiryStatus(p.expiry).color.includes('orange')).length} 
              subtext="Vencidos o vencen < 30 días"
              icon={AlertTriangle} 
              colorClass="bg-rose-50 text-rose-600" 
            />
          </div>
        )}

        {view === 'inventory' ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Toolbar */}
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Buscar por nombre o categoría..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3 items-center">
                <span className="text-sm text-slate-500 flex items-center gap-2">
                  <Filter size={16} /> Ordenar por:
                </span>
                <select 
                  className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-rose-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="expiry">Vencimiento</option>
                  <option value="stock">Cantidad Stock</option>
                  <option value="name">Nombre</option>
                </select>
                <button 
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  {sortOrder === 'asc' ? <TrendingUp size={18} className="text-slate-600"/> : <TrendingDown size={18} className="text-slate-600"/>}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4 font-semibold">Producto</th>
                    <th className="p-4 font-semibold">Categoría</th>
                    <th className="p-4 font-semibold text-center">Stock Actual</th>
                    <th className="p-4 font-semibold text-center">Gestión Rápida</th>
                    <th className="p-4 font-semibold">Vencimiento</th>
                    <th className="p-4 font-semibold text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock, product.minStock);
                    const expiryData = getExpiryStatus(product.expiry);
                    const ExpiryIcon = expiryData.icon;

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4">
                          <div className="font-medium text-slate-900">{product.name}</div>
                          <div className="text-xs text-slate-400">{product.unit}</div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className={`font-bold text-lg ${stockStatus.color.split(' ')[0]}`}>
                            {product.stock}
                          </div>
                          <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${stockStatus.color}`}>
                            Min: {product.minStock}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleUpdateStock(product.id, -1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                              title="Registrar Consumo"
                            >
                              <Minus size={14} />
                            </button>
                            <button 
                              onClick={() => handleUpdateStock(product.id, 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                              title="Reponer Stock"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600 font-mono">
                          {product.expiry}
                        </td>
                        <td className="p-4 text-right">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${expiryData.color}`}>
                            <ExpiryIcon size={12} />
                            {expiryData.text}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                <Package size={48} className="mx-auto mb-4 opacity-20" />
                <p>No se encontraron productos con ese criterio.</p>
              </div>
            )}
          </div>
        ) : (
          /* Add Product View */
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6 text-center">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Ingresar Nuevo Artículo</h2>
              <p className="text-slate-500">Complete los datos para el control de stock</p>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del Producto</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    placeholder="Ej: Crema Reafirmante Corporal"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Categoría</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option>Cabina</option>
                    <option>Inyectables</option>
                    <option>Descartables</option>
                    <option>Venta Público</option>
                    <option>Limpieza</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Unidad de Medida</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    placeholder="ml, cajas, unidades..."
                    value={newProduct.unit}
                    onChange={e => setNewProduct({...newProduct, unit: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Stock Inicial</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Stock Mínimo (Alerta)</label>
                  <input 
                    required
                    type="number" 
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    value={newProduct.minStock}
                    onChange={e => setNewProduct({...newProduct, minStock: parseInt(e.target.value)})}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Vencimiento</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    value={newProduct.expiry}
                    onChange={e => setNewProduct({...newProduct, expiry: e.target.value})}
                  />
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <AlertTriangle size={12} /> Importante para el cálculo de alertas automáticas
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setView('inventory')}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
