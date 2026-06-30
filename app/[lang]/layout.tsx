import type { Metadata } from "next";
import { Locale, dictionaries } from "@/core/domain/dictionaries";
import MainLayout from "@/components/templates/MainLayout";
import { redirect } from "next/navigation";
import "../globals.css";

export const metadata: Metadata = {
  title: "Gondowangi News Portal",
  description: "Portal Berita Gondowangi",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;

  if (!dictionaries[lang]) {
    redirect('/id/berita');
  }

  return (
    <html lang={lang}>
      <body>
        <MainLayout lang={lang}>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}