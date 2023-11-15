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
    ValorObjetivo: number,
    TipoMeta: string,
    DescripcionMeta: string,
    FechaCreacion: number
}