import { useRef, type FC } from 'react'
import { Input, AutoComplete, Button, type InputRef } from 'antd'

interface SearchButtonProps {
    options?: { value: string }[]
    onSearch?: (value: string) => void,
    onChange?: (value: string) => void,
}

const SearchButton: FC<SearchButtonProps> = ({ options, onSearch, onChange }) => {
    const inputRef = useRef<InputRef>(null)

    const onClick = () => {
        onSearch && onSearch(inputRef.current?.input?.value || '')
    }
    
    return (
        <div style={{
            display: 'flex',
            flex: 1,
        }}>
            <AutoComplete
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