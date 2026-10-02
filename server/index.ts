import createApp from './app'
import { services } from './services'

export const appServices = services()
const app = createApp(appServices)

export default app
