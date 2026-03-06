import {Input as InputAntd, type InputProps} from "antd"
import {twMerge} from "tailwind-merge"

function Input(props: InputProps) {
    const {className, ...restProps} = props
    const defaultClasses = "dark:bg-dark-bg-item w-full h-8 rounded-[20px]! placeholder-[#678d67]! [&_.ant-input]:rounded-[20px] dark:text-white  dark:border-terminal border pl-3 text-[14px] font-light dark:placeholder:text-dark-gray placeholder:text-[13px] leading-8 box-border border border-[#d0d5dd]"
    return (
        <InputAntd {...restProps} className={twMerge(defaultClasses, className)}/>
    )
}
export default Input