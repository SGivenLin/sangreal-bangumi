import { Card } from 'antd'
import type { ReactNode } from 'react'

export default function AuthorList( { children } : { children: ReactNode }) {
    return (
        <Card bodyStyle={{ padding: '16px 0 24px 0' }}>{ children }</Card>
    )
}
