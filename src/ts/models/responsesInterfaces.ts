export interface Routines {
    Series?: number,
    IDUsuario: string,
    Duracion?: number,
    Tipo: string,
    Repeticiones?: number,
    NombreEjercicio: string,
    Descripcion: string,
    ID: string,
}

export interface Goals {
    IDUsuario: string,
    IDMeta: string,
    ValorObjetivo: number,
    TipoMeta: string,
    DescripcionMeta: string,
    FechaCreacion: number
}