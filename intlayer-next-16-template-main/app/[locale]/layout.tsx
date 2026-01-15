import { getHTMLTextDir } from "intlayer";
import type { NextLayoutIntlayer } from "next-intlayer";
import { IntlayerClientProvider } from "next-intlayer";
import { ErrorBoundary, MockIndicator } from "../../components/common";
import { MockProvider } from "../../components/providers";
import { AuthProvider } from "../../src/contexts/auth-context";

export { generateStaticParams } from "next-intlayer";

const LocaleLayout: NextLayoutIntlayer = async ({ children, params }) => {
  const { locale } = await params;
  return (
    <IntlayerClientProvider locale={locale}>
      <html lang={locale} dir={getHTMLTextDir(locale)} suppressHydrationWarning>
        <head>
          <script
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('theme');
                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    var initialTheme = theme || systemTheme;
                    if (initialTheme === 'dark') {
                      document.documentElement.classList.add('dark');
                    }
                  } catch (e) {}
                })();
              `,
            }}
          />
        </head>
        <body suppressHydrationWarning>
          <AuthProvider>
            <MockProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
              <MockIndicator />
            </MockProvider>
          </AuthProvider>
        </body>
      </html>
    </IntlayerClientProvider>
  );
};

export default LocaleLayout;




