"use client";

import useAuthStore from "@/hooks/use-user";

export function GetCurrentUser() {
    const { getCompanyId } = useAuthStore.getState();
    return getCompanyId();
}

