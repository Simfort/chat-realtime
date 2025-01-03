import { createContext, ReactElement, useState } from "react";

interface ICount {
    count: number,
    setCount: () => number
}

const countContext = createContext<ICount>({
} as any)

export default function CountProvider({ children }: { children: ReactElement }) {
    const [value, setValue] = useState(0)
    const setCount = () => setValue((val) => val++) as any
    const count = value
    return <countContext.Provider value={{ count, setCount }} >{children}</countContext.Provider>
}

export { countContext }