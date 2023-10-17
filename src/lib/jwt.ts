import {sign, verify, decode} from 'jsonwebtoken'
const jwt = {
  sign: (payload:string) => {
    if(!process.env.TOKEN_SECRET) return null
    return sign(payload, process.env.TOKEN_SECRET)
  },
  verify: <T>(token: string):(T|null) =>  {
    if(!process.env.TOKEN_SECRET || !token) return null
    return verify(token, process.env.TOKEN_SECRET) as T
  },
  decode: <T>(token: string):T => {
    return decode(token) as T
  }
}

export default jwt