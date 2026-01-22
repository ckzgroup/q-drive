// useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DeviceInfo, getDeviceInfo } from '@/utils/device-info';

interface User {
    id: string;
    company_id: string;
    email: string;
    name: string;
    contact: string;
    profile: string;
    url: string;
    slogan: string;
    description: string;
    deviceInfo: DeviceInfo;
}

type AuthStore = {
    user: User | null;
    isAuthenticated: boolean;
    activeDevices: DeviceInfo[];
    theme: string; // Add theme property
    login: (user: User) => void;
    logout: () => void;
    getCompanyId: () => string | null;
    getActiveDevices: () => DeviceInfo[];
    removeDevice: (deviceId: string) => void;
    setTheme: (theme: string) => void; // Add setTheme function
};

const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            activeDevices: [] as DeviceInfo[],
            isAuthenticated: false,
            theme: 'system', // Set a default theme
            login: (user) => {
                const deviceInfo = getDeviceInfo();
                set({
                    user: { ...user, deviceInfo },
                    isAuthenticated: true,
                    activeDevices: [...get().activeDevices, deviceInfo],
                });
            },
            logout: () => {
                set({ user: null, isAuthenticated: false, activeDevices: [], theme: 'light' });
                localStorage.removeItem('auth');
            },
            getCompanyId: () => {
                const user = get().user;
                return user ? user.company_id : null;
            },
            getActiveDevices: () => get().activeDevices,
            removeDevice: (deviceId) => {
                const currentDevices = get().activeDevices;
                const updatedDevices = currentDevices.filter((device) => device.deviceId !== deviceId);
                set({ activeDevices: updatedDevices });
            },
            setTheme: (theme) => set({ theme }), // Function to set the theme
        }),
        {
            name: 'auth',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: (state) => {
                if (state && state.user) {
                    state.isAuthenticated = true;
                }
            },
        }
    )
);

export default useAuthStore;
