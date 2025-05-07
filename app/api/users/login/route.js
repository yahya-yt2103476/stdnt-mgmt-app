import UserRepo from "../../../repos/user-repo";

const userRepo = new UserRepo()
export async function POST(request, { params }) {
    const body = request.json()
    const user = await userRepo.findByEmail(body.email)

    if (user) {
        const { password, ...userWithoutPass } = user
        const id_token = signJwtAccessToken(userWithoutPass)
        const result = {
            ...userWithoutPass,
            id_token,
        }
        return new Response(JSON.stringify(result))
    } else {
        return new Response(JSON.stringify(null))
    }


}