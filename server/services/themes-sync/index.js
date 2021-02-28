'use strict'

import syncTheme from './sync-theme'
import * as fetchBackups from './backups-activity'
export default () => ({ syncTheme, ...fetchBackups })
