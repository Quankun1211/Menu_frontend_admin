import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { onRegisterApi } from "../services/api"

const useRegister = () => {
    const navigate = useNavigate()
    const {data, error, isPending, isError, mutate} = useMutation({
        mutationKey: ["register"],
        mutationFn: onRegisterApi,
        onSuccess: (data) => {
            if(data) {
                navigate("/account/login")
            }
        }
    })
    return {data, error, isPending, isError, mutate}
}

export default useRegister