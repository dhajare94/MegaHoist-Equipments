'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, Package, Mail, CheckCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function SparePartDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const sparePartId = params.id as string
  const showEnquiry = searchParams.get('enquiry') === 'true'

  const [sparePart, setSparePart] = useState<any>(null)
  const [relatedParts, setRelatedParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(showEnquiry)
  const [enquiryForm, setEnquiryForm] = useState({
    quantity: '',
    unit: '',
    additional: '',
    email: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (sparePartId) {
      fetchSparePartDetails()
    }
  }, [sparePartId])

  useEffect(() => {
    if (showEnquiry) {
      setIsEnquiryOpen(true)
    }
  }, [showEnquiry])

  const fetchSparePartDetails = async () => {
    try {
      const { data: sparePartData, error: sparePartError } = await supabase
        .from('spare_parts')
        .select(`
          *,
          products (
            id,
            name,
            description
          )
        `)
        .eq('id', sparePartId)
        .single()

      if (sparePartError) throw sparePartError

      const { data: relatedPartsData, error: relatedPartsError } = await supabase
        .from('spare_parts')
        .select('*')
        .eq('product_id', sparePartData.product_id)
        .neq('id', sparePartId)
        .limit(3)

      if (relatedPartsError) throw relatedPartsError

      setSparePart(sparePartData)
      setRelatedParts(relatedPartsData || [])
      setEnquiryForm(prev => ({ ...prev, unit: sparePartData.unit }))
    } catch (error) {
      console.error('Error fetching spare part details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('enquiries')
        .insert({
          spare_part_id: sparePartId,
          quantity: parseInt(enquiryForm.quantity),
          unit: enquiryForm.unit,
          additional: enquiryForm.additional,
          email: enquiryForm.email
        })

      if (error) throw error

      setSubmitted(true)
      setEnquiryForm({
        quantity: '',
        unit: sparePart?.unit || '',
        additional: '',
        email: ''
      })
    } catch (error) {
      console.error('Error submitting enquiry:', error)
      alert('Failed to submit enquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded w-3/4"></div>
                <div className="bg-gray-200 h-4 rounded w-full"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                <div className="bg-gray-200 h-10 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!sparePart) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Spare Part Not Found</h1>
          <p className="text-gray-600 mb-6">The spare part you're looking for doesn't exist or has been removed.</p>
          <Link href="/spare-parts">
            <Button>Back to Spare Parts</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/spare-parts" className="hover:text-blue-600">
            <ArrowLeft className="w-4 h-4 mr-1 inline" />
            Spare Parts
          </Link>
          <span>/</span>
          <span className="text-gray-900">{sparePart.name}</span>
        </nav>

        {/* Spare Part Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="relative">
            <img 
              src={sparePart.image_url} 
              alt={sparePart.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div>
            <div className="mb-4">
              {sparePart.products && (
                <Badge variant="secondary" className="mb-2">
                  {sparePart.products.name}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{sparePart.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl font-bold text-orange-600">₹{sparePart.price}</span>
                <Badge className="bg-blue-100 text-blue-800">{sparePart.unit}</Badge>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-lg text-gray-600">{sparePart.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Dialog open={isEnquiryOpen} onOpenChange={setIsEnquiryOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Enquiry
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Send Enquiry for {sparePart.name}</DialogTitle>
                  </DialogHeader>
                  {submitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Enquiry Sent Successfully!</h3>
                      <p className="text-gray-600 mb-4">We'll get back to you soon with pricing and availability.</p>
                      <Button onClick={() => {
                        setSubmitted(false)
                        setIsEnquiryOpen(false)
                      }}>
                        Close
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleEnquirySubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={enquiryForm.quantity}
                            onChange={(e) => setEnquiryForm(prev => ({ ...prev, quantity: e.target.value }))}
                            required
                            min="1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="unit">Unit</Label>
                          <Input
                            id="unit"
                            value={enquiryForm.unit}
                            onChange={(e) => setEnquiryForm(prev => ({ ...prev, unit: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={enquiryForm.email}
                          onChange={(e) => setEnquiryForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="additional">Additional Details (Optional)</Label>
                        <Textarea
                          id="additional"
                          value={enquiryForm.additional}
                          onChange={(e) => setEnquiryForm(prev => ({ ...prev, additional: e.target.value }))}
                          rows={3}
                          placeholder="Any specific requirements or questions..."
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? 'Sending...' : 'Send Enquiry'}
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Product Information */}
        {sparePart.products && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Product</h2>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl">{sparePart.products.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">
                  {sparePart.products.description}
                </CardDescription>
                <Link href={`/products/${sparePart.products.id}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    View Product Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Related Spare Parts */}
        {relatedParts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Spare Parts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedParts.map((part: any) => (
                <Card key={part.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={part.image_url} 
                      alt={part.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{part.name}</CardTitle>
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
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need This Spare Part?</h2>
          <p className="text-lg mb-6">Send us an enquiry for pricing and availability</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={isEnquiryOpen} onOpenChange={setIsEnquiryOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Enquiry
                </Button>
              </DialogTrigger>
            </Dialog>
            <Link href="/spare-parts">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Browse More Parts
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}