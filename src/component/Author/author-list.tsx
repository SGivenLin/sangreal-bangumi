import { Card } from 'antd'
import type { ReactNode } from 'react'

export default function AuthorList( { children } : { children: ReactNode }) {
    return (
        <Card>{ children }</Card>
    )
}
