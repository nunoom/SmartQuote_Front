"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Search, Mail, Phone, MapPin, Package, TrendingUp, Plus, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  productsCount: number;
  totalQuotations: number;
  averagePrice: number;
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  logo: string;
  category: string;
}

// Mock data com fotos placeholder
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechSupply Angola',
    email: 'contato@techsupply.ao',
    phone: '+244 923 456 789',
    address: 'Rua 1º de Maio, 123',
    city: 'Luanda',
    country: 'Angola',
    productsCount: 150,
    totalQuotations: 245,
    averagePrice: 25000,
    rating: 4.5,
    status: 'active',
    logo: 'https://ui-avatars.com/api/?name=TechSupply&background=3b82f6&color=fff&size=200',
    category: 'Tecnologia'
  },
  {
    id: '2',
    name: 'OfficeMax Luanda',
    email: 'vendas@officemax.ao',
    phone: '+244 912 345 678',
    address: 'Av. 4 de Fevereiro, 456',
    city: 'Luanda',
    country: 'Angola',
    productsCount: 320,
    totalQuotations: 567,
    averagePrice: 15000,
    rating: 4.8,
    status: 'active',
    logo: 'https://ui-avatars.com/api/?name=OfficeMax&background=10b981&color=fff&size=200',
    category: 'Escritório'
  },
  {
    id: '3',
    name: 'Industrial Parts Ltd',
    email: 'info@industrialparts.ao',
    phone: '+244 934 567 890',
    address: 'Zona Industrial, Lote 45',
    city: 'Benguela',
    country: 'Angola',
    productsCount: 89,
    totalQuotations: 134,
    averagePrice: 45000,
    rating: 4.2,
    status: 'active',
    logo: 'https://ui-avatars.com/api/?name=Industrial+Parts&background=f59e0b&color=fff&size=200',
    category: 'Industrial'
  },
  {
    id: '4',
    name: 'Construção Total',
    email: 'comercial@construcaototal.ao',
    phone: '+244 945 678 901',
    address: 'Rua da Missão, 789',
    city: 'Lubango',
    country: 'Angola',
    productsCount: 267,
    totalQuotations: 423,
    averagePrice: 35000,
    rating: 4.6,
    status: 'active',
    logo: 'https://ui-avatars.com/api/?name=Construcao+Total&background=8b5cf6&color=fff&size=200',
    category: 'Construção'
  },
  {
    id: '5',
    name: 'MedEquip Angola',
    email: 'vendas@medequip.ao',
    phone: '+244 956 789 012',
    address: 'Av. Revolução, 321',
    city: 'Luanda',
    country: 'Angola',
    productsCount: 145,
    totalQuotations: 198,
    averagePrice: 55000,
    rating: 4.9,
    status: 'active',
    logo: 'https://ui-avatars.com/api/?name=MedEquip&background=ec4899&color=fff&size=200',
    category: 'Médico'
  },
  {
    id: '6',
    name: 'AutoParts Premium',
    email: 'info@autoparts.ao',
    phone: '+244 967 890 123',
    address: 'Rua dos Mercadores, 654',
    city: 'Huambo',
    country: 'Angola',
    productsCount: 412,
    totalQuotations: 689,
    averagePrice: 28000,
    rating: 4.4,
    status: 'active',
    logo: 'https://ui-avatars.com/api/?name=AutoParts&background=ef4444&color=fff&size=200',
    category: 'Automóvel'
  },
  {
    id: '7',
    name: 'Electro Solutions',
    email: 'comercial@electro.ao',
    phone: '+244 978 901 234',
    address: 'Zona Verde, Lote 12',
    city: 'Luanda',
    country: 'Angola',
    productsCount: 98,
    totalQuotations: 156,
    averagePrice: 32000,
    rating: 4.1,
    status: 'pending',
    logo: 'https://ui-avatars.com/api/?name=Electro+Solutions&background=6366f1&color=fff&size=200',
    category: 'Eletrónica'
  },
  {
    id: '8',
    name: 'Green Supplies',
    email: 'vendas@greensupplies.ao',
    phone: '+244 989 012 345',
    address: 'Av. das Acácias, 987',
    city: 'Lubango',
    country: 'Angola',
    productsCount: 76,
    totalQuotations: 92,
    averagePrice: 18000,
    rating: 3.9,
    status: 'inactive',
    logo: 'https://ui-avatars.com/api/?name=Green+Supplies&background=14b8a6&color=fff&size=200',
    category: 'Sustentável'
  }
];

export default function SuppliersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [suppliers] = useState<Supplier[]>(mockSuppliers);

  const categories = Array.from(new Set(suppliers.map(s => s.category)));

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || supplier.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
    <DashboardLayout title="Fornecedores" icon={<Building2 className="h-5 w-5 text-white" />}>
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header com Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Fornecedores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{suppliers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {suppliers.filter(s => s.status === 'active').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Produtos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {suppliers.reduce((acc, s) => acc + s.productsCount, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Cotações Totais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {suppliers.reduce((acc, s) => acc + s.totalQuotations, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Lista de Fornecedores</CardTitle>
                  <CardDescription>
                    Gerencie e visualize todos os fornecedores cadastrados
                  </CardDescription>
                </div>
                {/* <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Fornecedor
                </Button> */}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, email ou cidade..."
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
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Suppliers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card 
                key={supplier.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => router.push(`/suppliers/${supplier.id}`)}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                        <img 
                          src={supplier.logo} 
                          alt={supplier.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {supplier.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(supplier.status)}
                          <Badge variant="outline" className="text-xs">
                            {supplier.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{supplier.city}, {supplier.country}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Package className="h-3 w-3" />
                          Produtos
                        </div>
                        <div className="font-semibold text-sm mt-1">{supplier.productsCount}</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <TrendingUp className="h-3 w-3" />
                          Cotações
                        </div>
                        <div className="font-semibold text-sm mt-1">{supplier.totalQuotations}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
                        <div className="font-semibold text-sm mt-1">
                          {supplier.rating} {getRatingStars(supplier.rating)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-gray-500 dark:text-gray-400">
                    Preço Médio: <span className="font-semibold text-gray-900 dark:text-white">
                      {supplier.averagePrice.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSuppliers.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Nenhum fornecedor encontrado</p>
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
