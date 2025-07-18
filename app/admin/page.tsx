'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Package, Wrench, Mail, Edit, Trash2, Eye } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/auth-store'

export default function AdminPage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  
  const [products, setProducts] = useState([])
  const [spareParts, setSpareParts] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    image_url: '',
    description: ''
  })
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  
  // Spare part form state
  const [sparePartForm, setSparePartForm] = useState({
    name: '',
    image_url: '',
    unit: '',
    price: '',
    description: '',
    product_id: ''
  })
  const [isSparePartDialogOpen, setIsSparePartDialogOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }
    fetchData()
  }, [isAuthenticated, router])

  const fetchData = async () => {
    try {
      const [productsRes, sparePartsRes, enquiriesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('spare_parts').select(`
          *,
          products (name)
        `).order('created_at', { ascending: false }),
        supabase.from('enquiries').select(`
          *,
          spare_parts (name, price, unit)
        `).order('created_at', { ascending: false })
      ])

      setProducts(productsRes.data || [])
      setSpareParts(sparePartsRes.data || [])
      setEnquiries(enquiriesRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('products')
        .insert(productForm)

      if (error) throw error

      setProductForm({ name: '', image_url: '', description: '' })
      setIsProductDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product')
    }
  }

  const handleSparePartSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('spare_parts')
        .insert({
          ...sparePartForm,
          price: parseFloat(sparePartForm.price),
          product_id: sparePartForm.product_id || null
        })

      if (error) throw error

      setSparePartForm({ name: '', image_url: '', unit: '', price: '', description: '', product_id: '' })
      setIsSparePartDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error adding spare part:', error)
      alert('Failed to add spare part')
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  const deleteSparePart = async (id: string) => {
    if (!confirm('Are you sure you want to delete this spare part?')) return
    
    try {
      const { error } = await supabase
        .from('spare_parts')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting spare part:', error)
      alert('Failed to delete spare part')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your products, spare parts, and enquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spare Parts</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{spareParts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Enquiries</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enquiries.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="spare-parts">Spare Parts</TabsTrigger>
            <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage your product catalog</CardDescription>
                  </div>
                  <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="product-name">Product Name</Label>
                          <Input
                            id="product-name"
                            value={productForm.name}
                            onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="product-image">Image URL</Label>
                          <Input
                            id="product-image"
                            type="url"
                            value={productForm.image_url}
                            onChange={(e) => setProductForm(prev => ({ ...prev, image_url: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="product-description">Description</Label>
                          <Textarea
                            id="product-description"
                            value={productForm.description}
                            onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                          />
                        </div>
                        <Button type="submit" className="w-full">Add Product</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: any) => (
                    <Card key={product.id} className="overflow-hidden">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <CardHeader>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/products/${product.id}`} target="_blank">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </a>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spare Parts Tab */}
          <TabsContent value="spare-parts">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Spare Parts</CardTitle>
                    <CardDescription>Manage your spare parts inventory</CardDescription>
                  </div>
                  <Dialog open={isSparePartDialogOpen} onOpenChange={setIsSparePartDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Spare Part
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Spare Part</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSparePartSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="spare-name">Spare Part Name</Label>
                          <Input
                            id="spare-name"
                            value={sparePartForm.name}
                            onChange={(e) => setSparePartForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="spare-image">Image URL</Label>
                          <Input
                            id="spare-image"
                            type="url"
                            value={sparePartForm.image_url}
                            onChange={(e) => setSparePartForm(prev => ({ ...prev, image_url: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="spare-unit">Unit</Label>
                            <Input
                              id="spare-unit"
                              value={sparePartForm.unit}
                              onChange={(e) => setSparePartForm(prev => ({ ...prev, unit: e.target.value }))}
                              placeholder="e.g., Nos, Pcs"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="spare-price">Price</Label>
                            <Input
                              id="spare-price"
                              type="number"
                              step="0.01"
                              value={sparePartForm.price}
                              onChange={(e) => setSparePartForm(prev => ({ ...prev, price: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="spare-product">Related Product (Optional)</Label>
                          <select
                            id="spare-product"
                            value={sparePartForm.product_id}
                            onChange={(e) => setSparePartForm(prev => ({ ...prev, product_id: e.target.value }))}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="">Select a product</option>
                            {products.map((product: any) => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="spare-description">Description</Label>
                          <Textarea
                            id="spare-description"
                            value={sparePartForm.description}
                            onChange={(e) => setSparePartForm(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                          />
                        </div>
                        <Button type="submit" className="w-full">Add Spare Part</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spareParts.map((part: any) => (
                    <Card key={part.id} className="overflow-hidden">
                      <img 
                        src={part.image_url} 
                        alt={part.name}
                        className="w-full h-48 object-cover"
                      />
                      <CardHeader>
                        <CardTitle className="text-lg">{part.name}</CardTitle>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{part.unit}</Badge>
                          <span className="font-bold text-orange-600">₹{part.price}</span>
                        </div>
                        {part.products && (
                          <Badge className="w-fit">{part.products.name}</Badge>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{part.description}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/spare-parts/${part.id}`} target="_blank">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </a>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteSparePart(part.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enquiries Tab */}
          <TabsContent value="enquiries">
            <Card>
              <CardHeader>
                <CardTitle>Customer Enquiries</CardTitle>
                <CardDescription>View and manage customer enquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enquiries.map((enquiry: any) => (
                    <Card key={enquiry.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {enquiry.spare_parts?.name || 'Unknown Part'}
                            </CardTitle>
                            <CardDescription>
                              From: {enquiry.email} • {new Date(enquiry.created_at).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge>New</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <span className="font-semibold">Quantity:</span> {enquiry.quantity} {enquiry.unit}
                          </div>
                          <div>
                            <span className="font-semibold">Unit Price:</span> ₹{enquiry.spare_parts?.price || 'N/A'}
                          </div>
                          <div>
                            <span className="font-semibold">Total Est.:</span> ₹{(enquiry.quantity * (enquiry.spare_parts?.price || 0)).toFixed(2)}
                          </div>
                        </div>
                        {enquiry.additional && (
                          <div className="mb-4">
                            <span className="font-semibold">Additional Details:</span>
                            <p className="text-gray-600 mt-1">{enquiry.additional}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Mail className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                          <Button size="sm" variant="outline">
                            Mark as Processed
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {enquiries.length === 0 && (
                    <div className="text-center py-8">
                      <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No enquiries yet</h3>
                      <p className="text-gray-500">Customer enquiries will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}