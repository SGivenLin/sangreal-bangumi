import { Card } from 'antd'
import type { ReactNode } from 'react'

export default function AuthorList( { children } : { children: ReactNode }) {
    return (
        <Card bodyStyle={{ paddingLeft: '0' }}>{ children }</Card>
    )
}
