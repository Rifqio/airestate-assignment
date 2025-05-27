import { ENDPOINTS } from '@/lib/endpoints'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

interface User {
    id: string
    email: string
    name: string
}

interface AuthState {
    user: User | null
    token: string | null
    loading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    register: (
        email: string,
        password: string,
        passwordConfirmation: string
    ) => Promise<void>
    logout: () => void
    setLoading: (isLoading: boolean) => void
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://103.175.220.122:6500'

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            loading: false,
            isAuthenticated: false,

            setLoading: (isLoading: boolean) => {
                set({ loading: isLoading })
            },

            login: async (email: string, password: string) => {
                set({ loading: true })
                try {
                    const response = await fetch(
                        `${BASE_URL}${ENDPOINTS.AUTH.LOGIN}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password })
                        }
                    )

                    const result = await response.json()

                    if (!response.ok) {
                        throw new Error(result.message || 'Login failed')
                    }

                    // Set authentication cookie for the middleware to detect
                    Cookies.set('nice-estate-auth', JSON.stringify({
                        token: result.data.token
                    }), { expires: 1 }) // Cookie expires in 7 days

                    set({
                        user: result.data.user,
                        token: result.data.token,
                        isAuthenticated: true,
                        loading: false
                    })
                } catch (error) {
                    set({ loading: false })
                    throw error
                }
            },

            register: async (
                email: string,
                password: string,
                passwordConfirmation: string
            ) => {
                set({ loading: true })
                try {
                    const response = await fetch(
                        `${BASE_URL}${ENDPOINTS.AUTH.REGISTER}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email,
                                password,
                                passwordConfirmation
                            })
                        }
                    )

                    const result = await response.json()

                    if (!response.ok) {
                        throw new Error(result.message || 'Registration failed')
                    }

                    set({ loading: false })
                } catch (error) {
                    set({ loading: false })
                    throw error
                }
            },

            logout: () => {
                // Remove the cookie when logging out
                Cookies.remove('nice-estate-auth')

                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                })
            }
        }),
        {
            name: 'nice-estate-auth'
        }
    )
)
