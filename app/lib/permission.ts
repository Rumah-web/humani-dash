import { useRouter } from "next/router"

export function withRoles(Component: any, requiredPermission: string[]) {
    return function WithRolesWrapper(props: any) {
        const router = useRouter()
        const hasPermission = requiredPermission
    }
}

function hasRequiredPermissions(requiredPermission: string[]): boolean {
    
    return true
}