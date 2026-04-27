import SectionHeading from "@/components/SectionHeading";
import PropertyListings from "@/components/PropertyListings";
import { getListedProperties } from "@/lib/properties";

export const metadata = {
  title: "Propiedades",
  description:
    "Explora todas las propiedades de venta y alquiler en destinos naturales de España — Costa Brava, Mallorca, Asturias, Sierra Nevada, Pirineos y más.",
};

export const dynamic = "force-dynamic";

export default async function PropiedadesPage() {
  const properties = await getListedProperties();

  return (
    <>
      {/* Page header */}
      <section className="bg-[#003e3c] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Nuestras propiedades"
            subtitle="Descubre nuestra selección de casas, villas y apartamentos en los destinos naturales más exclusivos de España."
            light
          />
        </div>
      </section>

      {/* Listings */}
      <section className="py-16 bg-[#f8f5f2] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PropertyListings properties={properties} />
        </div>
      </section>
    </>
  );
}
