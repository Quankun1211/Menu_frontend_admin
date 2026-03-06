import { Button as ButtonAntd, type ButtonProps } from "antd";
import { twMerge } from "tailwind-merge";

function Button(props: ButtonProps) {
    const {className, ...restProps} = props
    const defaultClasses = "min-w-[120px] bg-emerald h-10 rounded-[10px] text-white font-bold outline-none border-none hover:opacity-85 dark:bg-emerald-700"
    return (
        <ButtonAntd {...restProps} className={twMerge(defaultClasses, className)}/>
    )
}

export default Button