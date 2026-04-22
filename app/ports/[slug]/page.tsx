import { notFound } from "next/navigation";
import { PortPageClient } from "./PortPageClient";
import { getSeedPort } from "@/lib/mock/mockLiveBuilder";

export default function PortPage({ params }: { params: { slug: string } }) {
  if (!getSeedPort(params.slug)) notFound();
  return <PortPageClient slug={params.slug} />;
}
