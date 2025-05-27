export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/v1/login',
        REGISTER: '/api/auth/v1/register'
    },

    PROPERTIES: {
        LIST: '/api/properties/v1',
        CREATE: '/api/properties/v1',
        DELETE: (id: string) => `/api/properties/v1/${id}`,
        DETAIL: (id: string) => `/api/properties/v1/${id}`,
        UPDATE: (id: string) => `/api/properties/v1/${id}`
    }
}
