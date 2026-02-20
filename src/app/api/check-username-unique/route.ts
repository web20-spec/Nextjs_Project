import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { z } from "zod"
import { usernameValidation } from "@/src/schemas/signUpSchema";
import { NextResponse } from "next/server";


const usernameQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request) {
    
    // if (request.method !== 'GET') {
    //     return NextResponse.json(
    //         {
    //             success: false,
    //             message: "Only GET method allowed"
    //         },
    //         {
    //             status: 405
    //         }
    //     )
    // }               //* Not needed now as the Nextjs has updates and now-a-days we use App router instead Pages/ Page router

    await dbConnect();

    try {
        const {searchParams} = new URL(request.url)

        const queryParam = {
            username: searchParams.get('username')
        }

        // validate with zod

        const result = usernameQuerySchema.safeParse(queryParam)

        //console.log(result)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []

            return NextResponse.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(',') : "Invalid query paramters"
                },
                {
                    status: 400
                }
            )
        }

        const { username } = result.data

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

        if (existingVerifiedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Username is unique"
            },
            {
                status: 201
            }
        )


    } catch (error) {
        console.log("Error checking username", error);

        return NextResponse.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status: 500
            }
        )
        
    }
}