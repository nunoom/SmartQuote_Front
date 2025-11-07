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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Package,
  ArrowLeft,
  Edit,
  Trash2,
  Building2,
  DollarSign,
  TrendingUp,
  Box,
  Barcode,
  Calendar,
  Star
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  price: number;
  stock: number;
  deliveryTime: string;
  rating: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  images: string[];
  status: 'available' | 'low-stock' | 'out-of-stock';
  rating: number;
  totalSold: number;
  brand: string;
  model: string;
  warranty: string;
  weight: string;
  dimensions: string;
  suppliers: Supplier[];
  specifications: { [key: string]: string };
}

// Mock data expandido
const mockProduct: Product = {
  id: '1',
  name: 'Laptop Dell Latitude 5420',
  description: 'Laptop profissional com processador Intel i7, 16GB RAM, 512GB SSD',
  detailedDescription: 'O Dell Latitude 5420 é um laptop empresarial robusto e confiável, projetado para profissionais que exigem desempenho e segurança. Com processador Intel Core i7 de 11ª geração, oferece velocidade excepcional para multitarefas intensas. Equipado com 16GB de RAM DDR4 e SSD NVMe de 512GB, garante inicialização rápida e transferências de arquivos velozes. A tela Full HD de 14 polegadas proporciona imagens nítidas, enquanto a bateria de longa duração suporta um dia inteiro de trabalho.',
  category: 'Computadores',
  price: 450000,
  stock: 25,
  sku: 'DELL-LAT-5420',
  images: [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=800&fit=crop'
  ],
  status: 'available',
  rating: 4.7,
  totalSold: 156,
  brand: 'Dell',
  model: 'Latitude 5420',
  warranty: '3 anos',
  weight: '1.4 kg',
  dimensions: '32.1 x 21.8 x 1.9 cm',
  suppliers: [
    {
      id: '1',
      name: 'TechSupply Angola',
      price: 450000,
      stock: 25,
      deliveryTime: '2-3 dias úteis',
      rating: 4.5
    },
    {
      id: '2',
      name: 'OfficeMax Luanda',
      price: 465000,
      stock: 12,
      deliveryTime: '1-2 dias úteis',
      rating: 4.8
    },
    {
      id: '3',
      name: 'Industrial Parts Ltd',
      price: 440000,
      stock: 8,
      deliveryTime: '5-7 dias úteis',
      rating: 4.2
    }
  ],
  specifications: {
    'Processador': 'Intel Core i7-1165G7 (11ª Geração)',
    'Memória RAM': '16GB DDR4 3200MHz',
    'Armazenamento': '512GB SSD NVMe M.2',
    'Tela': '14" Full HD (1920x1080) Anti-Reflexo',
    'Placa Gráfica': 'Intel Iris Xe Graphics',
    'Sistema Operacional': 'Windows 11 Pro',
    'Conectividade': 'Wi-Fi 6, Bluetooth 5.1',
    'Portas': '2x USB 3.2, 1x USB-C Thunderbolt 4, HDMI 2.0, RJ45',
    'Bateria': '4 células, 63Wh',
    'Autonomia': 'Até 12 horas',
    'Webcam': 'HD 720p com obturador de privacidade',
    'Áudio': 'Alto-falantes estéreo, microfone duplo',
    'Teclado': 'Retroiluminado resistente a respingos',
    'Leitor Biométrico': 'Leitor de impressões digitais integrado',
    'Certificações': 'MIL-STD-810H'
  }
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product] = useState<Product>(mockProduct);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const lowestPrice = Math.min(...product.suppliers.map(s => s.price));
  const bestSupplier = product.suppliers.find(s => s.price === lowestPrice);

  return (
    <DashboardLayout title="Detalhes do Produto" icon={<Package className="h-5 w-5 text-white" />}>
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <Button variant="outline" onClick={() => router.push('/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Produtos
          </Button>

          {/* Main Product Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Carousel */}
            <Card>
              <CardContent className="p-6">
                <Carousel className="w-full">
                  <CarouselContent>
                    {product.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`${product.name} - Imagem ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>

                {/* Thumbnails */}
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-blue-500 scale-105'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumb ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product Info */}
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {product.name}
                      </h1>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(product.status)}
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {/* <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button> */}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400">
                    {product.description}
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {lowestPrice.toLocaleString('pt-AO', {
                        style: 'currency',
                        currency: 'AOA',
                        maximumFractionDigits: 0
                      })}
                    </span>
                    <span className="text-sm text-gray-500">
                      (melhor preço)
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{product.rating}</span>
                      <span className="text-sm text-gray-500">({product.totalSold} vendidos)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Barcode className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">SKU</div>
                      <div className="font-medium">{product.sku}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Marca</div>
                      <div className="font-medium">{product.brand}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Box className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Modelo</div>
                      <div className="font-medium">{product.model}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Garantia</div>
                      <div className="font-medium">{product.warranty}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-blue-900 dark:text-blue-100">
                        Melhor Fornecedor
                      </h5>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {bestSupplier?.name} - {bestSupplier?.deliveryTime}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {bestSupplier?.stock} unidades em estoque
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="specifications">Especificações</TabsTrigger>
              <TabsTrigger value="suppliers">Fornecedores ({product.suppliers.length})</TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Descrição Detalhada</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {product.detailedDescription}
                    </p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Peso</div>
                        <div className="font-semibold">{product.weight}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Dimensões</div>
                        <div className="font-semibold">{product.dimensions}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Garantia</div>
                        <div className="font-semibold">{product.warranty}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Especificações Técnicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-start justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <div className="font-medium text-gray-700 dark:text-gray-300 w-1/3">
                          {key}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 w-2/3 text-right">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Suppliers Tab */}
            <TabsContent value="suppliers" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fornecedores Disponíveis</CardTitle>
                  <CardDescription>
                    Compare preços e condições de diferentes fornecedores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {product.suppliers.map((supplier) => (
                      <div
                        key={supplier.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        onClick={() => router.push(`/suppliers/${supplier.id}`)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {supplier.name}
                              </h4>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <span>⭐ {supplier.rating}</span>
                                <span>Estoque: {supplier.stock} un.</span>
                                <span>{supplier.deliveryTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl text-gray-900 dark:text-white">
                            {supplier.price.toLocaleString('pt-AO', {
                              style: 'currency',
                              currency: 'AOA',
                              maximumFractionDigits: 0
                            })}
                          </div>
                          {supplier.price === lowestPrice && (
                            <Badge className="bg-green-500 mt-1">Melhor Preço</Badge>
                          )}
                        </div>
                      </div>
                    ))}
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
