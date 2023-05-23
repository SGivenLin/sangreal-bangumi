import { Card } from 'antd'
import type { ReactNode } from 'react'

export default function CollectionList( { children } : { children: ReactNode }) {
    return (
        <Card>{ children }</Card>
    )
}
