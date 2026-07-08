import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import type { Product, ProductVariant } from '@/types/database'

async function getProduct(slug: string): Promise<{ product: Product; variants: ProductVariant[] } | null> {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !product) return null

  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id)
    .eq('is_active', true)

  return { product, variants: variants ?? [] }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const data = await getProduct(params.slug)
  if (!data) notFound()

  return <ProductDetailClient product={data.product} variants={data.variants} />
}
