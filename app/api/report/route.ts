
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const GET = async (req: Request) => {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") as string);
    const pageSize = parseInt(searchParams.get("pageSize") as string);
    const reportType = searchParams.get("reportType") as string;

    if (!session || !session.user || !session.user.email) {
        return new Response(JSON.stringify({ message: "Not authenticated" }));
    }
    try {
        const [reports, totalCount] = await Promise.all([
            prisma.report.findMany({
                where: { userEmail: session.user.email },
                //...(reportType && reportType !== "" ? { reportType: reportType as "FULL" | "QUICK" } : {}), },
                // skip: (page - 1) * pageSize,
                //take: pageSize,
            }),
            prisma.report.count(),
        ]);
        return new NextResponse(JSON.stringify({ reports, totalCount }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong" }),
        );
    }
};

export const POST = async (req: Request) => {
    const session = await getServerSession(authOptions);
    const { report, reportType, name, reportId } = await req.json();

    if (!session || !session.user || !session.user.email) {
        return new Response(JSON.stringify({ message: "Not authenticated" }));
    }

    try {
        const profile = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { queries: true },
        });

        if (!profile) {
            return new NextResponse(JSON.stringify({ message: "Profile not found" }));
        }

        let savedReport;

        if (reportId && typeof reportId === 'string') {
            savedReport = await prisma.report.update({
                where: { id: reportId },
                data: {
                    data: report,
                    reportType: reportType,
                    name: name,
                },
            });
        } else {
            savedReport = await prisma.report.create({
                data: {
                    userEmail: session.user.email,
                    data: report,
                    reportType: reportType,
                    name: name,
                },
            });

        }

        return new NextResponse(JSON.stringify({ message: "success", report: savedReport }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong" }),
        );
    }
};

export const DELETE = async (req: Request) => {
    const session = await getServerSession(authOptions);
    const { id } = await req.json();
    if (!session || !session.user || !session.user.email) {
        return new Response(JSON.stringify({ message: "Not authenticated" }));
    }
    try {
        await prisma.report.delete({
            where: {
                id: id,
            },
        });
        return new NextResponse(JSON.stringify({ message: "success" }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong" }),
        );
    }
};
