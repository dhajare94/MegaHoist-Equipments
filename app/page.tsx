'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, Shield, Clock, Users, Wrench, Building2, Truck, Star } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [products, setProducts] = useState([])
  const [spareParts, setSpareParts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .limit(6)

      const { data: sparePartsData } = await supabase
        .from('spare_parts')
        .select('*')
        .limit(6)

      setProducts(productsData || [])
      setSpareParts(sparePartsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const services = [
    {
      title: 'RSP Rental',
      description: 'High-quality Rack & Pinion Platform systems for construction projects',
      icon: Building2,
      color: 'bg-orange-500'
    },
    {
      title: 'Cuplock Scaffolding',
      description: 'Safe and efficient scaffolding systems for all construction needs',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Material Hoist',
      description: 'Reliable material hoisting solutions for vertical transportation',
      icon: Truck,
      color: 'bg-green-500'
    }
  ]

  const features = [
    {
      title: 'Quality Equipment',
      description: 'All our equipment undergoes rigorous quality checks',
      icon: Shield
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support and maintenance',
      icon: Clock
    },
    {
      title: 'Expert Team',
      description: 'Skilled technicians for installation and support',
      icon: Users
    },
    {
      title: 'Maintenance Service',
      description: 'Regular maintenance and spare parts supply',
      icon: Wrench
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Premium Construction Equipment Rentals
              </h1>
              <p className="text-xl mb-8 text-orange-100">
                Your trusted partner for RSP, scaffolding, and material hoist rentals with comprehensive spare parts support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                    View Our Products <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                    Get Quote
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/162568/crane-construction-site-build-162568.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Construction Equipment" 
                className="rounded-lg shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Company */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Megahoist</h2>
              <p className="text-lg text-gray-600 mb-6">
                With over a decade of experience in the construction equipment industry, Megahoist has established itself as a leading provider of rental services and spare parts for construction projects across India.
              </p>
              <p className="text-gray-600 mb-6">
                We specialize in providing high-quality equipment rentals including RSP systems, cuplock scaffolding, and material hoists, along with comprehensive spare parts support and maintenance services.
              </p>
              <Link href="/services">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-orange-600 mb-2">500+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-600">Customer Support</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-purple-600 mb-2">100+</div>
                <div className="text-gray-600">Spare Parts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            To be the most trusted and reliable partner in the construction equipment industry, 
            providing innovative solutions that enhance productivity and safety at construction sites.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Excellence</h3>
              <p className="text-blue-100">Committed to delivering exceptional quality in every service</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Safety</h3>
              <p className="text-blue-100">Prioritizing safety in all our equipment and operations</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Partnership</h3>
              <p className="text-blue-100">Building long-term relationships with our clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">Comprehensive equipment rental and support services</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className={`${service.color} rounded-lg w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-lg text-gray-600">We provide unmatched service and quality in construction equipment rentals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <feature.icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landscape Image Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/3661191/pexels-photo-3661191.jpeg?auto=compress&cs=tinysrgb&w=1200" 
              alt="Construction Site" 
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">Building the Future</h2>
                <p className="text-xl mb-6">With reliable equipment and exceptional service</p>
                <Link href="/contact">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    Start Your Project
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h2>
            <p className="text-lg text-gray-600">High-quality construction equipment for all your project needs</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4">
                      {product.description}
                    </CardDescription>
                    <Link href={`/products/${product.id}`}>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Request a Quote */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Request a Quote</h2>
            <p className="text-xl text-orange-100">Get personalized pricing for your construction equipment needs</p>
          </div>
          <Card className="bg-white text-gray-900">
            <CardContent className="p-8">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input type="email" placeholder="Enter your email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Service Required</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Select a service</option>
                    <option>RSP Rental</option>
                    <option>Cuplock Scaffolding</option>
                    <option>Material Hoist</option>
                    <option>Spare Parts</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Project Details</label>
                  <Textarea placeholder="Tell us about your project requirements" rows={4} />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                    Submit Quote Request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Other Products Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Spare Parts & Accessories</h2>
            <p className="text-lg text-gray-600">Premium quality spare parts for all your equipment</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {spareParts.slice(0, 3).map((part: any) => (
                <Card key={part.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={part.image_url} 
                      alt={part.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{part.name}</CardTitle>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{part.unit}</Badge>
                      <span className="text-lg font-bold text-orange-600">₹{part.price}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4">
                      {part.description}
                    </CardDescription>
                    <Link href={`/spare-parts/${part.id}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link href="/spare-parts">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                View All Spare Parts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}