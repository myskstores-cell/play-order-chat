import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { productsApi } from "@/api/productsApi";
import { Container } from "@/components/common/Section";
import { Button } from "@/components/common/Button";
import { ProductGrid } from "@/components/product/ProductCard";
import { ErrorState, LoadingState } from "@/components/common/States";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { formatPrice, stockLabel } from "@/lib/format";
import { discountPercent, isAvailable } from "@/models/Product";
import { useCart } from "@/hooks/useCart";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — SK Sport Store` },
      {
        name: "description",
        content:
          "Product details, pricing and availability at SK Sport Store. Add to cart and order on WhatsApp.",
      },
      { property: "og:title", content: "Product — SK Sport Store" },
      {
        property: "og:description",
        content: "Product details and pricing at SK Sport Store.",
      },
    ],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const productQuery = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const product = await productsApi.bySlug(slug);
      if (!product) throw notFound();
      return product;
    },
  });

  const product = productQuery.data;

  const related = useQuery({
    queryKey: ["product", slug, "related"],
    queryFn: () => productsApi.related(product!, 4),
    enabled: !!product,
  });

  if (productQuery.isLoading) return <LoadingState label="Loading product…" />;
  if (productQuery.isError || !product)
    return (
      <Container className="py-16">
        <ErrorState
          title="Product unavailable"
          message="We couldn't find this product."
          onRetry={() => productQuery.refetch()}
        />
      </Container>
    );

  const discount = discountPercent(product);
  const available = isAvailable(product);
  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : [];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const currentImage = selectedImage || allImages[0] || null;

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Products", to: "/products" },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="surface-panel aspect-square overflow-hidden rounded-sm bg-surface-strong">
            {currentImage && (
              <img
                src={currentImage}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-300"
              />
            )}
          </div>

          {allImages.length > 1 && (
            <div className="mt-3.5 flex gap-2.5 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xs border-2 transition-all ${
                    currentImage === img
                      ? "border-primary shadow-md shadow-primary/20 scale-105"
                      : "border-border/70 hover:border-primary/50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.brand && <p className="eyebrow mb-2">{product.brand}</p>}
          <h1 className="display-title text-3xl sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {discount && (
              <span className="rounded-sm bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
                -{discount}%
              </span>
            )}
          </div>
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
            {stockLabel(product.stockStatus)} · SKU {product.sku}
          </p>

          {product.description && (
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Sport", product.sport],
              ["Size", product.size],
              ["Gender", product.gender],
              ["Material", product.material],
            ]
              .filter(([, value]) => !!value)
              .map(([label, value]) => (
                <div key={label as string} className="surface-panel rounded-sm p-3">
                  <dt className="eyebrow">{label}</dt>
                  <dd className="mt-1 text-foreground">{value}</dd>
                </div>
              ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-sm border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="h-11 w-11 text-lg text-foreground"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span aria-live="polite" className="w-10 text-center text-sm">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="h-11 w-11 text-lg text-foreground"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              >
                +
              </button>
            </div>
            <Button
              size="lg"
              disabled={!available}
              onClick={() => {
                addItem(product.id, quantity);
                setAdded(true);
              }}
            >
              {available ? "Add to cart" : "Out of stock"}
            </Button>
            <Link to="/cart">
              <Button size="lg" variant="outline">
                Go to cart
              </Button>
            </Link>
          </div>
          {added && (
            <p role="status" className="mt-3 text-xs text-primary">
              Added to your cart.
            </p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Orders are placed and confirmed over WhatsApp. No online payment.
          </p>
        </div>
      </div>

      {(related.data ?? []).length > 0 && (
        <section className="mt-16">
          <h2 className="display-title mb-6 text-2xl">You may also like</h2>
          <ProductGrid products={related.data ?? []} />
        </section>
      )}
    </Container>
  );
}
