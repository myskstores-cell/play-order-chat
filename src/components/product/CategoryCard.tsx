import { Link } from "@tanstack/react-router";
import type { Category } from "@/models/Category";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to="/category/$slug"
      params={{ slug: category.slug }}
      className="surface-panel group relative flex aspect-[4/3] items-end overflow-hidden rounded-sm"
    >
      {category.imageUrl && (
        <img
          src={category.imageUrl}
          alt={category.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-300 group-hover:scale-105"
        />
      )}
      <div className="relative w-full bg-gradient-to-t from-background to-transparent p-4">
        <h3 className="display-title text-xl">{category.name}</h3>
      </div>
    </Link>
  );
}
