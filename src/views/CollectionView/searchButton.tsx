import { useRef, type FC, useState } from 'react'
import { Input, AutoComplete, Button, type InputRef, type RefSelectProps } from 'antd'

interface SearchButtonProps {
    options?: { value: string }[]
    onSearch?: (value: string) => void,
    onChange?: (value: string) => void,
}

const SearchButton: FC<SearchButtonProps> = ({ options, onSearch, onChange }) => {
    const inputRef = useRef<InputRef>(null)
    const autoCompleteRef = useRef<RefSelectProps>(null)
    const [ isOpen, setIsOpen ] = useState<boolean | undefined>(undefined)

    const onClick = () => {
        onSearch && onSearch(inputRef.current?.input?.value || '')
    }

    const handleKeyPress = (e?:  React.KeyboardEvent<HTMLInputElement>) => {
        if (e?.key === 'Enter') {
            if (inputRef.current?.input?.value) {
                // 防止在首次补全回车搜索时，触发再次弹出
                setIsOpen(false)
                e.stopPropagation()
                autoCompleteRef.current?.blur()
                onSearch && onSearch(inputRef.current?.input?.value || '')
                setTimeout(() => {
                    setIsOpen(undefined)
                }, 300)
            }
        }
    }
    
    return (
        <div style={{
            display: 'flex',
            flex: 1,
        }}>
            <AutoComplete
                open={isOpen}
                ref={autoCompleteRef}
                options={options}
                autoFocus={true}
                onChange={onChange}
                allowClear
                getPopupContainer={() => document.querySelector('.app') || document.body}
                style={{ flex: 1 }}
            >
                <Input
                    ref={inputRef}
                    placeholder="Bangumi账号名称"
                    size="large"
                    onPressEnter={handleKeyPress}
                    style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        height: 40,
                        fontSize: 16,
                    }}
                />
            </AutoComplete>
            <Button
                type="primary"
                style={{
                    boxShadow: 'none',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    height: 40,
                    fontSize: 16,
                }}
                onClick={onClick}
            >
                <span style={{ fontSize: 16 }}>查询</span>
            </Button>
        </div>
    )
}

export default SearchButton