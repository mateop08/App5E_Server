
import UserGestor from "../models/Users.model";
import UserAssignedGroupGestor from "../models/UserAssignedGroups.model";
import { UserData } from '../middlewares/auth'
import { signToken, verifyLoginWithToken } from "../middlewares/auth"

const LoginGestor = {
    async Login(User: string, Password: string) {

        if (!await UserGestor.Exists(User)){
            throw(`No es posible iniciar sesión, el usuario ${User} no existe en la base de datos.`)
        }

        const correctCredentials = await UserGestor.ValidateCredentials(User, Password)
        if (!correctCredentials) {
            throw('No es posible iniciar sesión, credenciales incorrectas.')
        }
        else {
            const user = await UserGestor.GetByUserCode(User)
            const userGroups = await UserAssignedGroupGestor.ListGroupsByUserCode(User)

            const userData: UserData = {
                User: user.UserCode,
                Groups: userGroups
            }
            const token = signToken(userData)
            const sessionData = {...userData, token}
            return sessionData
        }
    },
    LoginWithToken(token: string) {
        const userData = verifyLoginWithToken(token)
        const sessionData = {...userData, token}
        return sessionData
    }
}
 

export default LoginGestor