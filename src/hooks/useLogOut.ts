import { useMutation } from "@tanstack/react-query"
import { useAppStore } from "../store/app.store"
import { onLogoutApi } from "../services/api"
import { useQueryClient } from "@tanstack/react-query"
import { clearTokens } from "../utils/token"

const useLogout = () => {
    const queryClient = useQueryClient()
    const {setUserData} = useAppStore()

    const {data, error, isPending, isError, mutate} = useMutation({
        mutationKey: ["logout"],
        mutationFn: onLogoutApi,
        onSettled: () => {
            clearTokens()
            setUserData(null)

            queryClient.clear()
            window.location.href = "/account/login"
        }
    })
    return {data, error, isPending, isError, mutate}
}

export default useLogout
