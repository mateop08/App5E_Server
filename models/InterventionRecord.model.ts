import { DateTime } from "luxon";

export interface InterventionRecord {
    CreationDate: DateTime,
    CreatedBy: string,
    ModificationDate: DateTime | null,
    ModifiedBy: string | null
}

export const InterventionRecordGestor = {

    ConstructFromDao (CreationDate: string, CreatedBy: string, 
        ModificationDate: string | null, ModifiedBy: string | null) {

        const interventionRecord: InterventionRecord = {
            CreationDate: DateTime.fromJSDate(new Date(CreationDate)),
            CreatedBy: CreatedBy,
            ModificationDate: ModificationDate !== null ? DateTime.fromJSDate(new Date(ModificationDate)) : null,
            ModifiedBy: ModifiedBy !== null ? ModifiedBy: null
        }

        return interventionRecord
    },

    AdaptToInsert (InterventionRecord: InterventionRecord) {
        const { CreationDate, ModificationDate, ...RestInterventionRecord } = InterventionRecord
        const adaptCreationDate = CreationDate.toSQL()
        const adaptModificationDate = ModificationDate !== null ? ModificationDate.toSQL() : null
        if (adaptCreationDate === null) throw("Error al convertir fecha de Intervention Record a string sql.")

        return {
            CreationDate: adaptCreationDate,
            ModificationDate: adaptModificationDate,
            ...RestInterventionRecord
        }
    },

    AdaptForUpdate (InterventionRecord: InterventionRecord) {
        const { CreationDate, ModificationDate, ModifiedBy, ...RestInterventionRecord } = InterventionRecord
        const adaptCreationDate = CreationDate.toSQL()
        const adaptModificationDate = ModificationDate !== null ? ModificationDate.toSQL() : null

        if (adaptCreationDate === null) throw("Error de InterventionRecord: error al convertir fecha de creación a string sql.")
        if (adaptModificationDate === null) throw("Error de InterventionRecord: error al convertir fecha de modificación a string sql.")
        if (ModifiedBy === null) throw("Error de InterventionRecord no se puede modificar con usuario null")

        return {
            CreationDate: adaptCreationDate,
            ModificationDate: adaptModificationDate,
            ModifiedBy: ModifiedBy,
            ...RestInterventionRecord
        }
    },

    AdaptToTransfer (InterventionRecord: InterventionRecord) {

        const {CreationDate, ModificationDate, ...RestInteventionRecord} = InterventionRecord
        const transferObject =  {
            CreationDate: CreationDate.toJSON(),
            ModificationDate: (ModificationDate !== null) ? ModificationDate.toJSON() : null,
            ...RestInteventionRecord
            
        }

        return transferObject
    }
}