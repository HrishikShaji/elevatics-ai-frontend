
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma"

export const GET = async (req: Request) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return new Response(JSON.stringify({ message: "Not authenticated", profile: null }));
    }
    try {
        const profile = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            select: {
                queries: true,
                name: true,
                id: true,
                email: true,
                dob: true,
                address: true,
                gender: true,
                nationality: true,
                role: true,
                plan: true,
                phoneNumber: true,
                profileImg: true,
                image: true,
                interests: true,
            },
        });

        return new NextResponse(JSON.stringify({ profile }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong" }),
        );
    }
};
