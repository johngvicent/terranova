import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePropertyListingSchema } from "@/lib/validations";

export async function PATCH(request, { params }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return Response.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = updatePropertyListingSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Datos no válidos", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingProperty) {
      return Response.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    const property = await prisma.property.update({
      where: { id },
      data: { isListed: result.data.isListed },
      select: { id: true, isListed: true },
    });

    return Response.json({ success: true, property });
  } catch (error) {
    console.error("[PATCH /api/properties/[id]]", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}