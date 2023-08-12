import { Card } from 'antd'
import type { ReactNode } from 'react'

export default function CollectionList( { children, title } : { children: ReactNode, title?: ReactNode }) {
    return (
        <Card title={title} bodyStyle={{ paddingLeft: '0', paddingRight: 0 }} style={{ marginBottom: '16px' }}>{ children }</Card>
    )
}
