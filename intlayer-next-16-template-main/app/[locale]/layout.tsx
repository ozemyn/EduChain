import { getHTMLTextDir } from "intlayer";
import { Inter } from "next/font/google";
import type { NextLayoutIntlayer } from "next-intlayer";
import { IntlayerClientProvider } from "next-intlayer";
import { ErrorBoundary, MockIndicator } from "../../components/common";
import { MockProvider } from "../../components/providers";

export { generateStaticParams } from "next-intlayer";

const inter = Inter({ subsets: ["latin"] });

const LocaleLayout: NextLayoutIntlayer = async ({ children, params }) => {
  const { locale } = await params;
  return (
    <IntlayerClientProvider locale={locale}>
      <html lang={locale} dir={getHTMLTextDir(locale)} suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          <MockProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
            <MockIndicator />
          </MockProvider>
        </body>
      </html>
    </IntlayerClientProvider>
  );
};

export default LocaleLayout;




