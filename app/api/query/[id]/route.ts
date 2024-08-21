
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export const POST = async (req: Request, params: { params: { id: string } }) => {
    try {
        const userExist = await prisma.user.findUnique({
            where: {
                id: params.params.id
            }
        })

        if (!userExist) {
            return new NextResponse(JSON.stringify({ message: "no user" }));
        }

        const currentQueries = userExist.queries
        const updatedUser = await prisma.user.update({
            where: {
                id: params.params.id
            },
            data: {
                queries: currentQueries - 1
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

        })
        return new NextResponse(JSON.stringify({ message: "queries updated", profile: updatedUser }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong" }),
        );
    }
};
