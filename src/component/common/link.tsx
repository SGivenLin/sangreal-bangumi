import React, { FC, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { baseUrl } from 'src/lib/const'
import { decodeHtml, decodeSubjectName } from 'src/lib/utils'
import {type  RouterItem } from '../Layout/router'
import { useRouterDisabled } from 'src/lib/hooks'
import { Tooltip } from 'antd'

type AnchorType = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>

interface BaseLinkProps {
    disabled?: boolean
    stop?: boolean
}

const BaseLink: FC<BaseLinkProps & AnchorType> = (props) => {
    const { disabled, stop, children ,...attrs } = props
    const onClick = getLinkOnClick({ disabled, stop })
    return <a
        target='_blank'
        onClick={onClick}
        rel="noreferrer"
        { ...attrs }>
        {children}
    </a>
}

interface AuthorLinkInfo extends BaseLinkProps {
    author: {
        author_name?: string,
        author_id?: number,
        name?: string,
        id?: number,
        [prop: string | number]: any
    }
}
const AuthorLink: FC<AuthorLinkInfo & AnchorType> = (props) => {
    const { author, ...attrs } = props
    const name = decodeHtml(author.author_name || author.name || '')
    const id = author.author_id || author.id
    return <BaseLink href={`${baseUrl}/person/${id}`} { ...attrs }>{name}</BaseLink>
}

interface BangumiLinkInfo extends BaseLinkProps {
    bangumi: {
        name_cn: string,
        name: string,
        id: number,
        [prop: string | number]: any
    }
}
const BangumiLink: FC<BangumiLinkInfo & AnchorType> = (props) => {
    const { bangumi, ...attrs } = props
    const _bangumi = decodeSubjectName(bangumi)
    return <BaseLink href={`${baseUrl}/subject/${bangumi.id || bangumi.subject_id}`} { ...attrs }>{ _bangumi.name_cn }</BaseLink>
}

interface UserNameLinkInfo extends BaseLinkProps {
    username: string
}

const UserNameLink: FC<UserNameLinkInfo & AnchorType> = (props) => {
    const { username, children, ...attrs } = props
    return <BaseLink href={`${baseUrl}/user/${username}`} { ...attrs }>{ children || username }</BaseLink>
}

const CollectionLink: FC<UserNameLinkInfo & AnchorType> = (props) => {
    const { username, ...attrs } = props
    return <BaseLink href={`${baseUrl}/anime/list/${username}/collect`} { ...attrs }></BaseLink>
}

function getLinkOnClick(option: BaseLinkProps | null) {
    if (!option) {
        return undefined
    }
    if (option.stop) {
        return (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined) => {
            e?.stopPropagation?.()
        }
    }
    if (option.disabled) {
        return (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined) => {
            e?.preventDefault()
        }
    }
}

interface commonLinkProps {
    route: Omit<RouterItem, 'element'>,
    children: ReactNode,
}

const CommonRouterLink: FC<commonLinkProps & React.RefAttributes<HTMLAnchorElement>> = (props) => {
    const { children, route } = props
    const disbaled =  useRouterDisabled()
    if (disbaled && route.sider?.disabledInfo?.depCollection) {
        return <Tooltip title={route.sider.disabledInfo.message}>
                <div style={{ cursor: 'not-allowed' }}><Link to={route.path} style={{ pointerEvents: 'none' }}>{ children }</Link></div>
            </Tooltip>
    } else {
        return <Link to={route.path}>{ children }</Link>
    }
}

export {
    AuthorLink,
    BangumiLink,
    UserNameLink,
    CollectionLink,
    CommonRouterLink,
}   