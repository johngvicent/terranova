import AdminPropertyCatalog from "@/components/admin/AdminPropertyCatalog";
import { getCatalogProperties } from "@/lib/properties";

export const metadata = {
  title: "Propiedades | Panel Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const properties = await getCatalogProperties();

  return <AdminPropertyCatalog initialProperties={properties} />;
}