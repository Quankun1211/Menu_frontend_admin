import { useMutation } from "@tanstack/react-query"
import { useAppStore } from "../store/app.store"
import { onLogoutApi } from "../services/api"
import { removeToken } from "../utils/token"
import { useQueryClient } from "@tanstack/react-query"

const useLogout = () => {
    const queryClient = useQueryClient()
    const {setUserData} = useAppStore()

    const {data, error, isPending, isError, mutate} = useMutation({
        mutationKey: ["logout"],
        mutationFn: onLogoutApi,
        onSuccess: () => {
            removeToken()
            setUserData(null)

            queryClient.clear()
            console.log("Logout successfully")
        }
    })
    return {data, error, isPending, isError, mutate}
}

export default useLogout