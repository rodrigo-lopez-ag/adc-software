export const Constants = {
    API_BASE_URL: "https://sheenfang.backendless.app/api/data",
    ROUTINES_GET_POST: "/TablaRutinas",
    OBJECTIVES_GET_POST: "/TablaMetas",
    ROUTINES_OBJECTID: (objectId: string): string => `/TablaRutinas/${objectId}`,
    OBJECTIVES_OBJECTID: (objectId: string): string => `/TablaMetas/${objectId}`
}