import UserClasificationControlDao from "../../dao/Ofima/UserClasificationControl.dao"

type ClasificationCode = 'MTCAJAREG' | 'CENTCOS' | 'CONSECUT' | 'MTMEDPAG' | 'VBODEGAS'

interface UserClasificationControl {
    ClasificationCode: ClasificationCode,
    AuthValue: string,
    User: string
}

const UserClasificationControlGestor = {

    ConstructFromDao(data: any) {
        const userClasificationControl: UserClasificationControl = {
            ClasificationCode: data.CODCLASIFICA.trimEnd(),
            AuthValue: data.VALORCLASIFICA.trimEnd(),
            User: data.CODUSUARIO.trimEnd()
        }
        return userClasificationControl
    },

    ConstrucListFromDao(data: any[]) {
        const list = data.map((e) => this.ConstructFromDao(e))
        return list
    },

    async ListAll() {
        const data = await UserClasificationControlDao.ListAll()
        const UserClasificationControlList = this.ConstrucListFromDao(data)
        return UserClasificationControlList
    },

    async FilterByUserAndClasficationCode(User: string, ClasificationCode: ClasificationCode) {
        const list = await this.ListAll()
        //console.log(list)
        const filterList = list.filter((e) => {
            if(e.User === User && e.ClasificationCode === ClasificationCode) {
                
                return e
            } else {
                return
            }
        })
        return filterList
    }

}

export default UserClasificationControlGestor