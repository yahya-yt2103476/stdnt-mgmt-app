import { NextResponse } from 'next/server';
import UserRepo from "../../../repos/user-repo";
import { signJwtAccessToken } from "../../../lib/jwt";

const userRepo = new UserRepo()
export async function POST(request, { params }) {
    const body = await request.json()
    console.log("from the endpoint, received the following");
    console.log(body);
    
    const user = await userRepo.findUserByEmailAndPassword(body.email,body.password, body.usertype)

    if (user) {
        const { password, ...userWithoutPass } = user
        const id_token = signJwtAccessToken(userWithoutPass)
        const result = {
            ...userWithoutPass,
            id_token,
        }
        return new Response(JSON.stringify(result))
    } else {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
            status: 401,
          });
    }


}