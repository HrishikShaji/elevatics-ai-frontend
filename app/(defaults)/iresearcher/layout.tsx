import { ResearchProvider } from "@/contexts/ResearcherContext";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ResearchProvider>
            {children}
        </ResearchProvider>
    );
}
