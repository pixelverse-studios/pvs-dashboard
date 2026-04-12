import { setTokenGetter } from './api-client'
import { getAccessToken } from './auth-service'

setTokenGetter(getAccessToken)
