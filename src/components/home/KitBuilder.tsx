import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Plus, Layers, ArrowRight } from "lucide-react";
import { Container, SectionHeader } from "@/components/common/Section";
import type { Product } from "@/models/Product";
import { formatPrice } from "@/lib/format";
import { whatsappService } from "@/services/whatsappService";
import { useKitPresets, type KitPresetConfig } from "@/services/homepageSettingsService";

export function KitBuilder({ products }: { products: Product[] }) {
  const kitPresets = useKitPresets();
  const [selectedKitId, setSelectedKitId] = useState<string>("cricket");

  // Determine active preset
  const activePreset: KitPresetConfig | undefined =
    kitPresets.find((k) => k.id === selectedKitId) ?? kitPresets[0];

  if (!activePreset) return null;

  const kitProducts = (activePreset.requiredProductSlugs || [])
    .map((slugOrId) => products.find((p) => p.slug === slugOrId || p.id === slugOrId))
    .filter((p): p is Product => !!p);

  // If no products match, fallback to sport-based matching
  const finalItems =
    kitProducts.length >= 1
      ? kitProducts
      : products
          .filter(
            (p) =>
              p.sport?.toLowerCase() === activePreset.sport.toLowerCase() ||
              p.categorySlug === activePreset.categorySlug,
          )
          .slice(0, 4);

  if (finalItems.length === 0) return null;

  const kitTotal = finalItems.reduce((sum, item) => sum + item.price, 0);

  const waKitMessage = whatsappService.buildKitInquiryMessage(
    activePreset.sport,
    finalItems.map((item) => ({ name: item.name, price: item.price })),
  );
  const waKitUrl = whatsappService.generateWhatsAppUrl(waKitMessage);


  return (
    <section className="py-12 sm:py-16 border-b border-border/60 bg-surface/30">
      <Container>
        <SectionHeader
          eyebrow="COMBO CROSS-SELL"
          title="BUILD YOUR KIT"
          description="Select your sport to bundle essential equipment and enquire on WhatsApp for package pricing."
        />

        {/* Sport Kit Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {kitPresets.map((preset) => {
            const isActive = preset.id === activePreset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedKitId(preset.id)}
                className={`rounded-xs px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "border border-border/80 bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        {/* Kit Showcase Box */}
        <div className="rounded-sm border border-border bg-surface p-6 sm:p-8 relative overflow-hidden">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                <Layers className="h-3.5 w-3.5" />
                <span>{activePreset.sport} BUNDLE</span>
              </div>
              <h3 className="display-title mt-1 text-2xl sm:text-4xl text-foreground">
                {activePreset.headline}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {activePreset.description}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Bundle Subtotal (Est.)
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-foreground">
                {formatPrice(kitTotal)}
              </span>
            </div>
          </div>

          {/* Kit Items Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {finalItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-xs border border-border/60 bg-surface-strong/50 p-4 transition-colors hover:border-primary/50"
              >
                <div className="relative aspect-square overflow-hidden rounded-xs bg-surface mb-3">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : null}
                  <span className="absolute top-2 left-2 rounded-2xs bg-background/90 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                    Part {index + 1}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    {item.brand && (
                      <p className="eyebrow text-[9px] font-bold text-muted-foreground">
                        {item.brand}
                      </p>
                    )}
                    <h4 className="line-clamp-2 text-xs font-bold text-foreground mt-0.5">
                      {item.name}
                    </h4>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-xs font-bold">
                    <span className="text-foreground">{formatPrice(item.price)}</span>
                    <Link
                      to="/product/$slug"
                      params={{ slug: item.slug }}
                      className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary"
                    >
                      Details →
                    </Link>
                  </div>
                </div>

                {index < finalItems.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 h-6 w-6 items-center justify-center rounded-full bg-background border border-border text-muted-foreground">
                    <Plus className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Kit Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60 pt-6">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              Want to customize sizes or add more items? Send this kit configuration to WhatsApp.
            </p>

            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <Link to="/category/$slug" params={{ slug: activePreset.categorySlug }}>
                <button
                  type="button"
                  className="h-11 w-full sm:w-auto px-5 rounded-xs border border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary/40 hover:bg-surface-strong inline-flex items-center justify-center gap-1.5"
                >
                  <span>Explore Sport</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>

              <a
                href={waKitUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="h-11 w-full sm:w-auto px-6 rounded-xs bg-whatsapp text-xs font-bold uppercase tracking-wider text-whatsapp-foreground hover:brightness-110 inline-flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enquire Kit on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
