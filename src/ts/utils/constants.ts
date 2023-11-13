export const Constants = {
    API_BASE_URL: "https://sheenfang.backendless.app/api/data",
    ROUTINES_PATH: "/TablaRutinas",
    GOALS_PATH: "/TablaMetas",
    ROUTINES_PATH_OBJECTID: (objectId: string): string => `/TablaRutinas/${objectId}`,
    GOALS_PAHT_OBJECTID: (objectId: string): string => `/TablaMetas/${objectId}`
}