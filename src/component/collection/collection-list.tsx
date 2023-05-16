import type { ReactNode } from 'react'

export default function CollectionList( { children } : { children: ReactNode }) {
    return (
        <div style={{
            padding: '20px'
        }}>
            { children }
        </div>
    )
}
