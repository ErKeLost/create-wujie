import child_process from 'child_process'
import path from 'path'
import fs from 'fs'
// import ora, { Color } from 'ora'
import util from 'util'

const execSync = child_process.execSync
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util.promisify(require('child_process').exec)

export const taskPre = (logInfo: string, type: 'start' | 'end') => {
  if (type === 'start') {
    return `task start(开始任务): ${logInfo} \r\n`
  } else {
    return `task end(任务结束): ${logInfo} \r\n`
  }
}

// 获取项目文件
export const getProjectPath = (dir = './'): string => {
  return path.join(process.cwd(), dir)
}

export function compose(middleware) {
  const otherOptions = {}
  function dispatch(index, otherOptions) {
    if (index == middleware.length) return
    const currMiddleware = middleware[index]
    currMiddleware((addOptions) => {
      dispatch(++index, { ...otherOptions, ...addOptions })
    }, otherOptions).catch((error) => {
      console.log('💣 发布失败，失败原因：', error)
    })
  }
  dispatch(0, otherOptions)
}

/**
 * 获取当前package.json的版本号
 */
export const getOriginPackageJson = (): Record<string, any> => {
  const packageJson = JSON.parse(
    fs.readFileSync(getProjectPath('package.json'), 'utf-8')
  )
  return packageJson
}
