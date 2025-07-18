'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowRight, Package, Search } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function SparePartsPage() {
  const [spareParts, setSpareParts] = useState([])
  const [filteredParts, setFilteredParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSpareParts()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = spareParts.filter((part: any) =>
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredParts(filtered)
    } else {
      setFilteredParts(spareParts)
    }
  }, [searchTerm, spareParts])

  const fetchSpareParts = async () => {
    try {
      const { data, error } = await supabase
        .from('spare_parts')
        .select(`
          *,
          products (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSpareParts(data || [])
      setFilteredParts(data || [])
    } catch (error) {
      console.error('Error fetching spare parts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Spare Parts</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              High-quality spare parts for all your construction equipment needs
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search spare parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>
      </section>

      {/* Spare Parts Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Spare Parts</h2>
            <p className="text-lg text-gray-600">Browse our comprehensive collection of spare parts</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredParts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredParts.map((part: any) => (
                <Card key={part.id} className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img 
                      src={part.image_url} 
                      alt={part.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 text-white">
                        {part.products?.name || 'General'}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                        ₹{part.price}
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300">
                      {part.name}
                    </CardTitle>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{part.unit}</Badge>
                      <span className="text-lg font-bold text-orange-600">₹{part.price}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-6">
                      {part.description}
                    </CardDescription>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href={`/spare-parts/${part.id}`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/spare-parts/${part.id}?enquiry=true`}>
                        <Button variant="outline" className="w-full sm:w-auto border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                          Enquire Now
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm ? 'No spare parts found' : 'No spare parts available'}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Spare parts will be displayed here once they are added.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Spare Parts Categories</h2>
            <p className="text-lg text-gray-600">Our spare parts are organized by equipment type</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">RSP Parts</h3>
              <p className="text-gray-600">Rack bars, pinion gears, safety components, and more</p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hoist Parts</h3>
              <p className="text-gray-600">Motors, brakes, cables, and control systems</p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Scaffolding Parts</h3>
              <p className="text-gray-600">Standards, ledgers, couplers, and accessories</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find What You Need?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Contact us directly for custom spare parts or if you need assistance finding the right component for your equipment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Contact Us
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}