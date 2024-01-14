import * as url from 'url'
import bcrypt from 'bcrypt'

export const __filename = url.fileURLToPath(import.meta.url)
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

//empezamos a trabajar para hashear el password
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//usará el compare para comparar
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password) 