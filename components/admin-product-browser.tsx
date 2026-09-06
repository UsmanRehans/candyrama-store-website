'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Copy, ExternalLink, ImagePlus, Plus, Search } from 'lucide-react';

type AdminProduct = {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  productFamily: string | null;
  flavor: string | null;
  category: string;
  status: string;
  variants: Array<{
    id: string;
    sku: string;
    sizeSig: string | null;
    priceCents: number | null;
    stockQty: number | null;
    active: boolean;
  }>;
  images: Array<{ id: string; url: string; alt: string }>;
};

const categories = [
  'GUMMIES',
  'SOUR',
  'SPICY',
  'BRITTLE',
  'BARK',
  'CHOCOLATE',
  'CHEWS',
  'GIFT_BOXES',
  'SEASONAL',
];

export function AdminProductBrowser({ token }: { token: string }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const authorizedFetch = useCallback(
    (url: string, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      headers.set('Authorization', `Bearer ${token}`);
      return fetch(url, { ...init, headers });
    },
    [token],
  );

  const search = useCallback(
    async (value: string) => {
      setBusy(true);
      try {
        const response = await authorizedFetch(
          `/api/v1/admin/products?q=${encodeURIComponent(value)}`,
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        setProducts(result.data);
        setSelectedId((current) =>
          current &&
          result.data.some((product: AdminProduct) => product.id === current)
            ? current
            : result.data[0]?.id,
        );
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : 'Catalog search failed.',
        );
      } finally {
        setBusy(false);
      }
    },
    [authorizedFetch],
  );

  useEffect(() => {
    queueMicrotask(() => void search(''));
  }, [search]);
  const selected = products.find((product) => product.id === selectedId);

  async function createProduct(form: HTMLFormElement) {
    setBusy(true);
    setMessage('');
    const data = new FormData(form);
    try {
      const response = await authorizedFetch('/api/v1/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setShowCreate(false);
      form.reset();
      setQuery(result.data.sku);
      setMessage('Draft product created.');
      await search(result.data.sku);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Product creation failed.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(file: File) {
    if (!selected) return;
    setBusy(true);
    setMessage('');
    const body = new FormData();
    body.set('file', file);
    body.set('alt', selected.name);
    try {
      const response = await authorizedFetch(
        `/api/v1/admin/products/${selected.id}/image`,
        { method: 'POST', body },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setMessage('Image uploaded and added to the reusable asset library.');
      await search(query);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Image upload failed.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function copyForChatGPT(image: AdminProduct['images'][number]) {
    const text = `Use this CandyRama product image as the editing reference: ${image.url}\nProduct: ${selected?.name}\nSKU: ${selected?.sku ?? 'not assigned'}\nAlt text: ${image.alt}`;
    await navigator.clipboard.writeText(text);
    setMessage('ChatGPT-ready image reference copied.');
  }

  return (
    <section className="catalog-browser">
      <div className="catalog-browser-heading">
        <div>
          <h2>Find and add products</h2>
          <p>
            Search names, product SKUs, variant SKUs, families, and flavors.
          </p>
        </div>
        <button
          className="button primary"
          onClick={() => setShowCreate((value) => !value)}
        >
          <Plus /> Add product
        </button>
      </div>
      {showCreate && (
        <form
          className="catalog-create-form"
          onSubmit={(event) => {
            event.preventDefault();
            void createProduct(event.currentTarget);
          }}
        >
          <label>
            Name
            <input name="name" required minLength={2} />
          </label>
          <label>
            Slug
            <input name="slug" required placeholder="lowercase-with-dashes" />
          </label>
          <label>
            Product SKU
            <input name="sku" required />
          </label>
          <label>
            Family
            <input name="productFamily" required />
          </label>
          <label>
            Flavor
            <input name="flavor" required defaultValue="Original" />
          </label>
          <label>
            Category
            <select name="category">
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            Mapping confidence
            <select name="categoryConfidence">
              <option>REVIEW</option>
              <option>HIGH</option>
            </select>
          </label>
          <label>
            First variant SKU
            <input name="variantSku" />
          </label>
          <label>
            Size signature
            <input name="sizeSig" placeholder="8oz|2pk" />
          </label>
          <label>
            Net weight
            <input name="netWeight" placeholder="8 oz" />
          </label>
          <input type="hidden" name="brand" value="TWISTED_TREATZ" />
          <div className="admin-actions">
            <button className="button primary" disabled={busy}>
              Create draft
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <label className="catalog-search">
        <Search />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void search(query);
          }}
          placeholder="Search catalog or exact SKU"
        />
        <button
          className="button secondary"
          disabled={busy}
          onClick={() => void search(query)}
        >
          Search
        </button>
      </label>
      <div className="catalog-browser-layout">
        <div className="catalog-results">
          {products.map((product) => (
            <button
              key={product.id}
              className={
                product.id === selectedId
                  ? 'catalog-result selected'
                  : 'catalog-result'
              }
              onClick={() => setSelectedId(product.id)}
            >
              <strong>{product.name}</strong>
              <span>{product.sku ?? 'SKU missing'}</span>
              <small>
                {product.productFamily} · {product.flavor} ·{' '}
                {product.variants.length} variants · {product.images.length}{' '}
                images
              </small>
            </button>
          ))}
          {!busy && products.length === 0 && <p>No matching products.</p>}
        </div>
        {selected && (
          <article className="catalog-product-detail">
            <div>
              <span className="product-badge">{selected.status}</span>
              <h3>{selected.name}</h3>
              <p>{selected.sku}</p>
            </div>
            <h4>Variants</h4>
            <div className="variant-admin-list">
              {selected.variants.map((variant) => (
                <div key={variant.id}>
                  <code>{variant.sku}</code>
                  <span>{variant.sizeSig || 'size unknown'}</span>
                  <span>
                    {variant.priceCents === null
                      ? 'price pending'
                      : `$${(variant.priceCents / 100).toFixed(2)}`}
                  </span>
                  <span>
                    {variant.stockQty === null
                      ? 'stock unknown'
                      : `${variant.stockQty} in stock`}
                  </span>
                </div>
              ))}
            </div>
            <div className="image-library-heading">
              <div>
                <h4>Image library</h4>
                <p>
                  Public, stable image URLs can be pasted into ChatGPT or
                  supplied to the OpenAI API.
                </p>
              </div>
              <label className={`button secondary${busy ? ' disabled' : ''}`}>
                <ImagePlus /> Upload image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={busy}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadImage(file);
                    event.target.value = '';
                  }}
                />
              </label>
            </div>
            <div className="product-image-library">
              {selected.images.map((image) => (
                <figure key={image.id}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={320}
                    height={320}
                    unoptimized
                  />
                  <figcaption>
                    <span>{image.alt}</span>
                    <div>
                      <button
                        title="Copy for ChatGPT"
                        onClick={() => void copyForChatGPT(image)}
                      >
                        <Copy />
                      </button>
                      <a
                        title="Open original"
                        href={image.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink />
                      </a>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </article>
        )}
      </div>
      {message && <output className="admin-message">{message}</output>}
    </section>
  );
}
