'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  imageUrl: string | null
  variantName: string | null
  qty: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  removeItem: (productId: string, variantName: string | null) => void
  updateQty: (productId: string, variantName: string | null, qty: number) => void
  clearCart: () => void
  subtotal: number
  totalQty: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)
const STORAGE_KEY = 'empritlicious_cart'

function sameLine(a: CartItem, productId: string, variantName: string | null) {
  return a.productId === productId && a.variantName === variantName
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Muat keranjang dari localStorage sekali saat mount di browser
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // localStorage tidak tersedia (mis. private mode) — abaikan, mulai kosong
    }
    setHydrated(true)
  }, [])

  // Simpan tiap kali items berubah, setelah hydrasi awal selesai
  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  function addItem(item: Omit<CartItem, 'qty'>, qty: number = 1) {
    setItems((prev) => {
      const existing = prev.find((p) => sameLine(p, item.productId, item.variantName))
      if (existing) {
        return prev.map((p) =>
          sameLine(p, item.productId, item.variantName) ? { ...p, qty: p.qty + qty } : p
        )
      }
      return [...prev, { ...item, qty }]
    })
  }

  function removeItem(productId: string, variantName: string | null) {
    setItems((prev) => prev.filter((p) => !sameLine(p, productId, variantName)))
  }

  function updateQty(productId: string, variantName: string | null, qty: number) {
    if (qty < 1) return
    setItems((prev) =>
      prev.map((p) => (sameLine(p, productId, variantName) ? { ...p, qty } : p))
    )
  }

  function clearCart() {
    setItems([])
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, subtotal, totalQty }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart harus dipakai di dalam <CartProvider>')
  return ctx
}
