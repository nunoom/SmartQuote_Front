"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Package,
  TrendingUp,
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
}

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  website?: string;
  productsCount: number;
  totalQuotations: number;
  averagePrice: number;
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  logo: string;
  category: string;
  description: string;
  taxId: string;
  joinedDate: string;
  products: Product[];
}

// Mock data expandido
const mockSupplier: Supplier = {
  id: '1',
  name: 'TechSupply Angola',
  email: 'contato@techsupply.ao',
  phone: '+244 923 456 789',
  address: 'Rua 1º de Maio, 123',
  city: 'Luanda',
  country: 'Angola',
  website: 'www.techsupply.ao',
  productsCount: 150,
  totalQuotations: 245,
  averagePrice: 25000,
  rating: 4.5,
  status: 'active',
  logo: 'https://ui-avatars.com/api/?name=TechSupply&background=3b82f6&color=fff&size=400',
  category: 'Tecnologia',
  description: 'Fornecedor líder em equipamentos de tecnologia e informática em Angola. Oferecemos soluções completas para empresas de todos os tamanhos.',
  taxId: 'AO123456789',
  joinedDate: '2023-03-15',
  products: [
    { id: '1', name: 'Laptop Dell Latitude 5420', category: 'Computadores', price: 450000, stock: 25, sku: 'DELL-LAT-5420' },
    { id: '2', name: 'Monitor LG 27" 4K', category: 'Monitores', price: 85000, stock: 40, sku: 'LG-MON-27-4K' },
    { id: '3', name: 'Teclado Mecânico Logitech', category: 'Periféricos', price: 15000, stock: 60, sku: 'LOG-KEY-MEC' },
    { id: '4', name: 'Mouse Wireless HP', category: 'Periféricos', price: 8000, stock: 100, sku: 'HP-MOU-WLS' },
    { id: '5', name: 'Impressora HP LaserJet Pro', category: 'Impressoras', price: 120000, stock: 15, sku: 'HP-LJ-PRO' },
    { id: '6', name: 'Webcam Logitech HD', category: 'Periféricos', price: 12000, stock: 35, sku: 'LOG-WEB-HD' },
    { id: '7', name: 'Headset Jabra Evolve', category: 'Áudio', price: 25000, stock: 50, sku: 'JAB-HDS-EVO' },
    { id: '8', name: 'SSD Samsung 1TB', category: 'Armazenamento', price: 35000, stock: 80, sku: 'SAM-SSD-1TB' }
  ]
};

export default function SupplierDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [supplier] = useState<Supplier>(mockSupplier);

  const getStatusBadge = (status: Supplier['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inativo</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pendente</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  };

  return (
    <DashboardLayout title="Detalhes do Fornecedor" icon={<Building2 className="h-5 w-5 text-white" />}>
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <Button variant="outline" onClick={() => router.push('/suppliers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Fornecedores
          </Button>

          {/* Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo */}
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  <img 
                    src={supplier.logo} 
                    alt={supplier.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {supplier.name}
                      </h1>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(supplier.status)}
                        <Badge variant="outline">{supplier.category}</Badge>
                        <span className="text-sm text-gray-500">
                          {supplier.rating} {getRatingStars(supplier.rating)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {/* <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover
                      </Button> */}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400">
                    {supplier.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:underline">
                        {supplier.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{supplier.address}, {supplier.city}</span>
                    </div>
                    {supplier.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a href={`https://${supplier.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {supplier.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span>NIF: {supplier.taxId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Desde {new Date(supplier.joinedDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Produtos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{supplier.productsCount}</div>
                <p className="text-xs text-gray-500 mt-1">produtos cadastrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Cotações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{supplier.totalQuotations}</div>
                <p className="text-xs text-gray-500 mt-1">cotações geradas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Preço Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {supplier.averagePrice.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">por produto</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{supplier.rating}/5.0</div>
                <p className="text-xs text-gray-500 mt-1">{getRatingStars(supplier.rating)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">Produtos ({supplier.products.length})</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Produtos do Fornecedor</CardTitle>
                  <CardDescription>
                    Lista completa de produtos oferecidos por {supplier.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {supplier.products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        onClick={() => router.push(`/products/${product.id}`)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {product.category}
                                </Badge>
                                <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900 dark:text-white">
                            {product.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
                          </div>
                          <div className="text-sm text-gray-500">
                            Estoque: {product.stock} un.
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Transações</CardTitle>
                  <CardDescription>
                    Últimas cotações e pedidos com {supplier.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Histórico em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas Detalhadas</CardTitle>
                  <CardDescription>
                    Análise de performance e métricas do fornecedor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Estatísticas em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
