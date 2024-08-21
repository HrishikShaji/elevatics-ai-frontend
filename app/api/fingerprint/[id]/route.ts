import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export const GET = async (req: Request, params: { params: { id: string } }) => {
    console.log("this is the fingerprint", params.params.id)
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


        console.log("existing fingerprint",)
        return new NextResponse(JSON.stringify({ message: "fingerPrint exist", fingerPrint: fingerPrintExist }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong" }),
        );
    }
};
