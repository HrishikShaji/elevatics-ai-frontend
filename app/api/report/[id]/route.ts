

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma"

export const GET = async (req: Request, params: { params: { id: string } }) => {
    const session = await getServerSession(authOptions);

    {/*

    if (!session || !session.user || !session.user.email) {
        return new Response(JSON.stringify({ message: "Not authenticated" }));
    }
*/}
    try {
        const report = await prisma.report.findUnique({
            where: {
                id: params.params.id
            }
        })
        return new NextResponse(JSON.stringify({ report }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong" }),
        );
    }
};
