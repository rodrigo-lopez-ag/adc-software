export interface Routines {
    created: number,
    ownerId?: string,
    Series?: number,
    IDUsuario: string,
    Duracion?: number,
    Tipo: string,
    Repeticiones?: number,
    ___class: string,
    NombreEjercicio?: string,
    Descripcion: string,
    ID: string,
    updated?: number,
    objectId: string
}

export interface Goals {
    IDUsuario: string,
    IDMeta: string,
    created: number,
    ValorObjetivo: number,
    ___class: string,
    TipoMeta: string,
    ownerId?: string,
    DescripcionMeta: string,
    updated: number,
    FechaCreacion: number,
    objectId: string
}