import { FC } from 'react'
import { baseUrl } from 'src/lib/const'
import { decodeHtml, decodeSubjectName } from 'src/lib/utils'

type AnchorType = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>

interface CommonLink {
    disabled?: boolean
    stop?: boolean
}

const BaseLink: FC<CommonLink & AnchorType> = (props) => {
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

interface AuthorLinkInfo extends CommonLink {
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

interface BangumiLinkInfo extends CommonLink {
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
    return <BaseLink href={`${baseUrl}/person/${bangumi.id || bangumi.subject_id}`} { ...attrs }>{ _bangumi.name_cn }</BaseLink>
}

interface UserNameLinkInfo extends CommonLink {
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

function getLinkOnClick(option: CommonLink | null) {
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

export {
    AuthorLink,
    BangumiLink,
    UserNameLink,
    CollectionLink,
}   