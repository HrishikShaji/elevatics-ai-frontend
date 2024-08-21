import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export const GET = async (req: Request, params: { params: { id: string } }) => {
    try {
        const fingerPrintExist = await prisma.fingerprint.findUnique({
            where: {
                browserId: params.params.id
            }
        })

        if (!fingerPrintExist) {
            const createdFingerPrint = await prisma.fingerprint.create({
                data: {
                    browserId: params.params.id
                }
            })

            return new NextResponse(JSON.stringify({ message: "fingerPrint created", fingerPrint: createdFingerPrint }));

        }
        return new NextResponse(JSON.stringify({ message: "fingerPrint exist", fingerPrint: fingerPrintExist }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong" }),
        );
    }
};

export const POST = async (req: Request, params: { params: { id: string } }) => {
    try {
        const fingerPrintExist = await prisma.fingerprint.findUnique({
            where: {
                browserId: params.params.id
            }
        })

        if (!fingerPrintExist) {
            return new NextResponse(JSON.stringify({ message: "no fingerPrint" }));
        }

        const currentUsage = fingerPrintExist.usage
        const updatedFingerPrint = await prisma.fingerprint.update({
            where: {
                browserId: params.params.id
            },
            data: {
                usage: currentUsage + 1
            }
        })
        return new NextResponse(JSON.stringify({ message: "fingerPrint updated", fingerPrint: updatedFingerPrint }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong" }),
        );
    }
};
