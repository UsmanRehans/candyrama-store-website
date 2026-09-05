'use client';
import { useCart } from './cart-provider';
export function CartCount() { return <span>{useCart().count}</span>; }
