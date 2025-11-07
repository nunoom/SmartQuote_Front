"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Search, Building2, DollarSign, TrendingUp, Plus, Filter, Box } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  supplier: {
    id: string;
    name: string;
  };
  images: string[];
  status: 'available' | 'low-stock' | 'out-of-stock';
  rating: number;
  totalSold: number;
}

// Mock data com múltiplas imagens placeholder por produto
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Dell Latitude 5420',
    description: 'Laptop profissional com processador Intel i7, 16GB RAM, 512GB SSD',
    category: 'Computadores',
    price: 450000,
    stock: 25,
    sku: 'DELL-LAT-5420',
    supplier: { id: '1', name: 'TechSupply Angola' },
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop'
    ],
    status: 'available',
    rating: 4.7,
    totalSold: 156
  },
  {
    id: '2',
    name: 'Monitor LG 27" 4K UHD',
    description: 'Monitor profissional 27 polegadas, resolução 4K, HDR10',
    category: 'Monitores',
    price: 85000,
    stock: 8,
    sku: 'LG-MON-27-4K',
    supplier: { id: '1', name: 'TechSupply Angola' },
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop'
    ],
    status: 'low-stock',
    rating: 4.5,
    totalSold: 89
  },
  {
    id: '3',
    name: 'Teclado Mecânico Logitech G Pro',
    description: 'Teclado mecânico gamer com switches Cherry MX, RGB',
    category: 'Periféricos',
    price: 15000,
    stock: 60,
    sku: 'LOG-KEY-MEC',
    supplier: { id: '1', name: 'TechSupply Angola' },
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800&h=600&fit=crop'
    ],
    status: 'available',
    rating: 4.8,
    totalSold: 234
  },
  {
    id: '4',
    name: 'Mouse Wireless HP X3500',
    description: 'Mouse sem fio com sensor óptico de alta precisão',
    category: 'Periféricos',
    price: 8000,
    stock: 0,
    sku: 'HP-MOU-WLS',
    supplier: { id: '1', name: 'TechSupply Angola' },
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&h=600&fit=crop'
    ],
    status: 'out-of-stock',
    rating: 4.2,
    totalSold: 412
  },
  {
    id: '5',
    name: 'Impressora HP LaserJet Pro M404dn',
    description: 'Impressora laser monocromática com duplex automático',
    category: 'Impressoras',
    price: 120000,
    stock: 15,
    sku: 'HP-LJ-PRO',
    supplier: { id: '1', name: 'TechSupply Angola' },
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586882829491-b81178aa622e?w=800&h=600&fit=crop'
    ],
    status: 'available',
    rating: 4.6,
    totalSold: 98
  },
  {
    id: '6',
    name: 'Webcam Logitech C920 HD Pro',
    description: 'Webcam Full HD 1080p com microfone estéreo embutido',
    category: 'Periféricos',
    price: 12000,
    stock: 35,
    sku: 'LOG-WEB-HD',
    supplier: { id: '1', name: 'TechSupply Angola' },
    images: [
      'https://images.unsplash.com/photo-1625573023299-ce2eb7a3dd34?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=600&fit=crop'
    ],
    status: 'available',
    rating: 4.4,
    totalSold: 187
  },
  {
    id: '7',
    name: 'Headset Jabra Evolve 75',
    description: 'Headset profissional com cancelamento de ruído ativo',
    category: 'Áudio',
    price: 25000,
    stock: 5,
    sku: 'JAB-HDS-EVO',
    supplier: { id: '1', name: 'TechSupply Angola' },
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1577174881658-0f30157e8d5c?w=800&h=600&fit=crop'
    ],
    status: 'low-stock',
    rating: 4.9,
    totalSold: 145
  },
  {
    id: '8',
    name: 'SSD Samsung 870 EVO 1TB',
    description: 'SSD SATA de alta velocidade para upgrade de desempenho',
    category: 'Armazenamento',
    price: 35000,
    stock: 80,
    sku: 'SAM-SSD-1TB',
    supplier: { id: '1', name: 'TechSupply Angola' },
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&h=600&fit=crop'
    ],
    status: 'available',
    rating: 4.7,
    totalSold: 267
  }
];

export default function ProductsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [products] = useState<Product[]>(mockProducts);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Disponível</Badge>;
      case 'low-stock':
        return <Badge className="bg-amber-500">Estoque Baixo</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-red-500">Esgotado</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  };

  return (
    <DashboardLayout title="Produtos" icon={<Package className="h-5 w-5 text-white" />}>
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header com Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Produtos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.status === 'available').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Estoque Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {products.reduce((acc, p) => acc + p.stock, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Vendido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {products.reduce((acc, p) => acc + p.totalSold, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Catálogo de Produtos</CardTitle>
                  <CardDescription>
                    Navegue e gerencie todos os produtos disponíveis
                  </CardDescription>
                </div>
                {/* <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button> */}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, SKU ou fornecedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Categorias</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Status</SelectItem>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="low-stock">Estoque Baixo</SelectItem>
                    <SelectItem value="out-of-stock">Esgotado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                onClick={() => router.push(`/products/${product.id}`)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Image Carousel Preview */}
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="flex h-full transition-transform duration-500"
                    style={{
                      transform: hoveredProduct === product.id && product.images.length > 1
                        ? `translateX(-${100}%)`
                        : 'translateX(0)'
                    }}
                  >
                    {product.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover flex-shrink-0"
                      />
                    ))}
                  </div>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {product.images.length} fotos
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    {getStatusBadge(product.status)}
                  </div>
                </div>

                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {product.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Building2 className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{product.supplier.name}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="text-xs text-gray-500">Preço</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {product.price.toLocaleString('pt-AO', { 
                          style: 'currency', 
                          currency: 'AOA',
                          maximumFractionDigits: 0 
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Estoque</div>
                      <div className={cn(
                        "text-xl font-bold",
                        product.stock > 10 ? "text-green-600" :
                        product.stock > 0 ? "text-amber-600" :
                        "text-red-600"
                      )}>
                        {product.stock}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                      <span className="font-semibold">{product.rating}</span>
                      <span className="text-xs">{getRatingStars(product.rating)}</span>
                    </div>
                    <div className="text-gray-500">
                      <TrendingUp className="h-4 w-4 inline mr-1" />
                      {product.totalSold} vendidos
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Nenhum produto encontrado</p>
                  <p className="text-sm mt-2">Tente ajustar os filtros de busca</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
