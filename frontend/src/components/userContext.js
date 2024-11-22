import {createContext} from 'react'

const userContext = createContext({
    user:{
        userName: "",
        email: "",
        password: ""
    }
})

export default userContext;