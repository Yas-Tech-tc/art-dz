import { Link } from "react-router-dom";
import Container from "../components/Container";
import SectionTitle from "../components/SectionTitle";
import ProductGrid from "../components/ProductGrid";
import PatternDivider from "../components/PatternDivider";
import { categories } from "../data/categories";
import { useGetProductsQuery } from "../api/api";

const linkButton =
  "inline-flex min-h-12 items-center rounded-full bg-terracotta px-8 font-bold text-white hover:bg-terracotta-dark";

function Home() {
  const { data, isLoading, isError } = useGetProductsQuery({ limit: 50 });
  const products = data?.items ?? [];
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <Container className="flex items-center justify-between gap-10 py-12 md:py-20">
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-wide text-olive">
            Fait main en Algérie
          </p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">
            L'artisanat algérien, <span className="text-terracotta">porte après porte</span>
          </h1>
          <p className="mt-4 text-lg">
            Céramiques, décoration, mode et cadeaux faits main, inspirés des portes de la
            Casbah et des motifs amazighs.
          </p>
          <Link to="/boutique" className={`mt-8 ${linkButton}`}>
            Découvrir la boutique
          </Link>
        </div>

        {/* Arche décorative (cachée sur mobile) */}
        <div className="hidden h-96 w-72 shrink-0 items-end justify-center overflow-hidden rounded-t-full rounded-b-2xl bg-night md:flex">
          <div className="flex h-72 w-56 items-end justify-center rounded-t-full bg-terracotta">
            <div className="flex h-56 w-40 items-center justify-center rounded-t-full bg-saffron">
              <svg width="70" height="70" viewBox="0 0 90 90" fill="none" stroke="#1E2A4A"
                strokeWidth="3" aria-hidden="true">
                <path d="M45 6 L84 45 L45 84 L6 45Z" />
                <path d="M45 26 L64 45 L45 64 L26 45Z" />
              </svg>
            </div>
          </div>
        </div>
      </Container>

      <PatternDivider className="text-terracotta" />

      {/* Catégories */}
      <Container className="pt-12">
        <SectionTitle title="Nos catégories" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/boutique?categorie=${c.id}`}
              className="flex flex-col items-center gap-3 rounded-t-full rounded-b-2xl border border-night/15 bg-cream px-4 pb-6 pt-12 text-center hover:border-terracotta"
            >
              <svg width="32" height="32" viewBox="0 0 90 90" fill="none"
                stroke="#B84A26" strokeWidth="4" aria-hidden="true">
                <path d="M45 6 L84 45 L45 84 L6 45Z" />
              </svg>
              <span className="font-medium leading-snug">{c.name}</span>
            </Link>
          ))}
        </div>
      </Container>

      {/* Produits vedettes */}
      <Container className="pt-16">
        <div className="flex items-baseline justify-between">
          <SectionTitle title="Produits vedettes" />
          <Link to="/boutique" className="font-bold text-terracotta hover:underline">
            Tout voir
          </Link>
        </div>

        {isLoading ? (
          <p className="py-8">Chargement des produits vedettes...</p>
        ) : isError ? (
          <p className="py-8 text-terracotta">Impossible de charger les produits.</p>
        ) : (
          <ProductGrid products={featured} />
        )}
      </Container>

      {/* Bandeau */}
      <Container className="pt-16">
        <section className="rounded-2xl bg-night px-6 py-12 text-center text-sand sm:px-12">
          <h2 className="text-2xl sm:text-3xl">Chaque pièce raconte une histoire</h2>
          <p className="mx-auto mt-3 max-w-xl text-sand/85">
            Nos objets sont créés et décorés à la main par des artisans algériens.
            Pas de production en série : chaque article est unique.
          </p>
          <Link to="/boutique" className={`mt-6 ${linkButton}`}>
            Voir toute la collection
          </Link>
        </section>
      </Container>
    </>
  );
}

export default Home;
