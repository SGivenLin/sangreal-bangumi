import { FC, useCallback, useMemo } from "react"
import { ipcRenderer } from 'electron'
import { type ProgressInfo, type UpdateInfo } from "electron-updater"
import {
    updateAvailable,
    updateNotAvailable,
    updateError,
    updateDownloaded,
    updateDownload,
    downloadProgress,
    updateDownloadCancel,
    updateCancelled,
    openDownloadDir,
    updateCheck,
} from 'src/electron/ipcMain/const'
import { Button, Space, notification, Progress } from 'antd'
import { useDispatch } from "react-redux"
import { setAppInfo } from "src/store/appInfo"
import { NotificationInstance } from "antd/es/notification/interface"
import Store from "electron-store"
import { debounce } from 'lodash-es'
import log from "electron-log"

const updaterStore = new Store<{
    ignoreVersion: string[]
}>({
    name: 'updater',
    defaults: {
        ignoreVersion: [],
    },
})

const toMB = (bt: number) => (bt / 1024 / 1024).toFixed(2) + ' MB'

const DownloadProgress: FC<{ progressInfo: ProgressInfo | undefined }> = ({ progressInfo }) =>{
    return <div>
        正在下载，请勿关闭
        <Progress percent={Math.round(progressInfo?.percent || 0)} />
        <span style={{ color: '#666' }}>{ toMB(progressInfo?.transferred || 0) } / { progressInfo ? toMB(progressInfo.total) : '- MB' }</span>
    </div>
}

let isInit = false
let isForce = false

const useUpdaterAndNotify = () => {
    const [ api, contextHolder ] = notification.useNotification()
    const { initUpdater } = _useUpdaterAndNotify(api)
    const checkUpdate = useMemo(() => debounce((_isForce: boolean = false) => {
        isForce = _isForce
        !isInit && initUpdater()
        isInit = true
        return ipcRenderer.invoke(updateCheck)
    }, 1000, {
        leading: true,
        trailing: false,
    }), [initUpdater])

    return {
        contextHolder,
        checkUpdate,
    }
}

function _useUpdaterAndNotify(api: NotificationInstance) {
    const dispatch = useDispatch()
    const notifyKey = 'updater'
    
    const initUpdater = useCallback(() =>  {
        const onDownloadProgress = (e?: any, data?: ProgressInfo) => {
            api.info({
                message: '更新提示',
                description: <DownloadProgress progressInfo={data}></DownloadProgress>,
                btn: <Button type="link" size="small" onClick={() => {
                    api.destroy(notifyKey)
                    ipcRenderer.send(updateDownloadCancel)
                }}>取消下载</Button>,
                key: notifyKey,
                closeIcon: null,
                duration: null,
            })
        }

        ipcRenderer.on(updateAvailable, (e, data: UpdateInfo) => {
            const updateDownloadHandle = () => {
                ipcRenderer.send(updateDownload)
                onDownloadProgress()
            }
            const ignoreUpdate = () => {
                api.destroy(notifyKey)
                const ignoreVersion = updaterStore.get('ignoreVersion')
                ignoreVersion.push(notifyKey)
                updaterStore.set('ignoreVersion', [ ...new Set(ignoreVersion) ])
            }
            if (!isForce && updaterStore.get('ignoreVersion').includes(notifyKey)) {
                log.info('ignoreVersion', notifyKey, updaterStore.get('ignoreVersion'))
                return
            }

            const btn =
                 <Space>
                     <Button type="link" size="small" onClick={ignoreUpdate}>
                    忽略此版本
                     </Button>
                     <Button type="primary" size="small" onClick={updateDownloadHandle}>
                    下载更新
                     </Button>
                 </Space>

            api.warning({
                message: '更新提示',
                description: <div>
                    <div>检测到最新版本：{data?.version}</div>
                    <div>发布时间：{new Date(data?.releaseDate).toLocaleString()}</div>
                </div>,
                key: notifyKey,
                btn,
                duration: null,
            })
        })

        ipcRenderer.on(updateNotAvailable, (e, data: UpdateInfo) => {
            dispatch(setAppInfo({ isLatest: true }))
        })
        
        ipcRenderer.on(updateError, (e, err: string, existDir: boolean) => {
            api.destroy(notifyKey)
            api.error({
                message: '更新提示',
                description: <div>
                    <div>更新失败（请尝试手动下载安装）</div>
                    <div style={{
                        maxHeight: 100,
                        overflowY: 'auto',
                        background: 'rgb(244,245,247)',
                        borderRadius: 4,
                        color: 'red',
                        padding: '2px 4px',
                        marginTop: 4,
                    }}>
                        <code style={{
                            whiteSpace: 'pre-wrap',
                        }}>{ err }</code>
                    </div>
                </div>,
                key: 'error:' + notifyKey,
                btn: <Space>
                    <Button type="link" size="small" href="https://github.com/SGivenLin/sangreal-bangumi/releases/latest" target="_blank">去github.com下载</Button>
                    {
                        existDir && <Button type="link" size="small" onClick={() => {
                            ipcRenderer.send(openDownloadDir)
                        }}>打开下载目录(若下载完成)</Button>
                    }
                </Space>,
            })
        })

        ipcRenderer.on(updateDownloaded, () => {
            api.success({
                message: '更新提示',
                description: '下载完成，正在重新安装...',
                key: notifyKey,
            })
        })

        ipcRenderer.on(updateCancelled, () => {
            api.info({
                message: '更新提示',
                description: '已取消下载',
                key: notifyKey,
            })
        })

        ipcRenderer.on(downloadProgress, onDownloadProgress)
    }, [api, dispatch])

    return { initUpdater }
}

export default useUpdaterAndNotify