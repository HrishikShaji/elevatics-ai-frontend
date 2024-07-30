import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { QuickReportProvider } from '@/contexts/QuickReportContext';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { SettingsProvider } from '@/contexts/SettingsContext';
import NextAuthProvider from '@/providers/NextAuthProvider';
import { AccountProvider } from '@/contexts/AccountContext';

export const metadata: Metadata = {
    title: {
        template: 'Elevatics',
        default: 'Elevatics',
    },
};
const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html className="custom-scrollbar" lang="en">
            <body className={nunito.variable}>
                <ReactQueryProvider>
                    <NextAuthProvider>
                        <AccountProvider>
                            <SettingsProvider>
                                <ProviderComponent>
                                    <QuickReportProvider>
                                        {children}
                                    </QuickReportProvider>
                                </ProviderComponent>
                            </SettingsProvider>
                        </AccountProvider>
                    </NextAuthProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
