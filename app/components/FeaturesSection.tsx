"use client";

import { Users, Calendar, DollarSign, Share2 } from "lucide-react";

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Users className="h-8 w-8 text-[#22c55e]" />,
    title: "Gestiona Grupos",
    description:
      "Crea y administra grupos de cumpleaños. Agrega miembros, define montos y organiza todo en un solo lugar.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-[#22c55e]" />,
    title: "Eventos de Cumpleaños",
    description:
      "Visualiza todos los cumpleaños próximos. Genera eventos automáticamente y mantén un calendario actualizado.",
  },
  {
    icon: <DollarSign className="h-8 w-8 text-[#22c55e]" />,
    title: "Control de Pagos",
    description:
      "Registra pagos, sube comprobantes y lleva un seguimiento detallado de quién ha pagado y quién falta.",
  },
  {
    icon: <Share2 className="h-8 w-8 text-[#22c55e]" />,
    title: "Comparte Fácilmente",
    description:
      "Comparte información de cumpleaños por WhatsApp, genera códigos QR y descarga PDFs con toda la información.",
  },
];

export function FeaturesSection(): JSX.Element {
  return (
    <section className="px-4 py-12 md:py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4 md:text-4xl">
          Todo lo que necesitas para gestionar tus tandas
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Una plataforma simple y eficiente diseñada para hacer la gestión de
          tandas de cumpleaños más fácil que nunca.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

