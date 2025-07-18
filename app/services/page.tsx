'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, Truck, Users, Wrench, Package, ArrowUpDown, ChevronRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function ServicesPage() {
  const coreServices = [
    {
      title: 'RSP Rental',
      description: 'High-quality Rack & Pinion Platform systems for efficient vertical transportation at construction sites.',
      icon: Building2,
      features: ['Heavy-duty construction', 'Safety certified', 'Various load capacities', 'Expert installation'],
      image: 'https://images.pexels.com/photos/162568/crane-construction-site-build-162568.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      title: 'Material Hoist Rental',
      description: 'Reliable material hoisting solutions for moving construction materials vertically with ease.',
      icon: Truck,
      features: ['Electric & manual options', 'Various lifting capacities', 'Safety brake systems', 'Weather resistant'],
      image: 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      title: 'Cuplock Scaffolding Rental',
      description: 'Safe and efficient scaffolding systems for all types of construction and maintenance work.',
      icon: Users,
      features: ['Quick assembly', 'Flexible configurations', 'Load-bearing capacity', 'Safety compliance'],
      image: 'https://images.pexels.com/photos/3661191/pexels-photo-3661191.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ]

  const microServices = [
    {
      title: 'Equipment Shifting',
      description: 'Professional equipment relocation services with proper handling and safety measures.',
      icon: Truck
    },
    {
      title: 'Installation Services',
      description: 'Expert installation of all rental equipment by certified technicians.',
      icon: Wrench
    },
    {
      title: 'Dismantling Services',
      description: 'Safe and efficient dismantling of equipment after project completion.',
      icon: ArrowUpDown
    },
    {
      title: 'Loading & Unloading',
      description: 'Professional loading and unloading services for equipment transportation.',
      icon: Package
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive construction equipment rental and support services to meet all your project needs
            </p>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Services</h2>
            <p className="text-lg text-gray-600">Our main equipment rental services for construction projects</p>
          </div>
          
          <div className="space-y-12">
            {coreServices.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${index % 2 === 1 ? 'lg:grid-cols-2' : ''}`}>
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  </div>
                  <div className={`p-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="flex items-center mb-4">
                      <div className="bg-orange-100 rounded-lg p-3 mr-4">
                        <service.icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <ChevronRight className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/contact">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        Get Quote
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Micro Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Support Services</h2>
            <p className="text-lg text-gray-600">Additional services to ensure smooth project execution</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {microServices.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                    <service.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Spare Parts Sales */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Spare Parts Sales</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              We also supply high-quality spare parts for all types of construction equipment. 
              Our extensive inventory ensures you get the right parts when you need them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/spare-parts">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                  Browse Spare Parts
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                  Contact for Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Service Process</h2>
            <p className="text-lg text-gray-600">How we deliver exceptional service from start to finish</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultation</h3>
              <p className="text-gray-600">We assess your project needs and recommend the best equipment</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery</h3>
              <p className="text-gray-600">Equipment is delivered to your site at the scheduled time</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Installation</h3>
              <p className="text-gray-600">Our experts install and test the equipment for safe operation</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600">Ongoing maintenance and support throughout your project</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}