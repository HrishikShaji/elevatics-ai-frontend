
import { InvestorProvider } from "@/contexts/InvestorContext";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <InvestorProvider>
            {children}
        </InvestorProvider>
    );
}
