import { Form, Radio, InputNumber, Switch, Tooltip, Checkbox, Button, Card } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store'
import { sortByForm } from 'src/store/author'
import { jobMap, allRelation } from 'src/lib/const'
import { useLoading, useScrollToTop } from 'src/lib/hooks'
import './select-form.styl'

const CheckboxGroup = Checkbox.Group

enum weightType {
    relation,
    subject
}

interface SortType {
    weight: weightType,
    useRate: boolean,
    subjectCount: number,
    relation: string[],
}
type JobMapKey = keyof typeof jobMap
const plainOptions = Object.keys(jobMap) as JobMapKey[]
const initialValues: SortType = { relation: plainOptions, subjectCount: 2, weight: weightType.subject, useRate: true }
const AuthorForm: React.FC = () => {
    const [ resetDisabled, setResetDisabled ] = useState(true)
    const [form] = Form.useForm<SortType>()
    const dispatch = useAppDispatch()

    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
    const formBtnLayout = { wrapperCol: { offset: formItemLayout.labelCol.span, span: formItemLayout.wrapperCol.span } }
    const onFormChange = (val: Partial<SortType>, allVal: SortType) => {
        let disabled = true
        for(const key in allVal) {
            // @ts-ignore
            if (JSON.stringify(allVal[key]) !== JSON.stringify(initialValues[key])) {
                disabled = false
                break
            }
        }
        setResetDisabled(disabled)
    }

    const onReset = () => {
        form.resetFields()
    }

    const [ loading, onSubmit ] = useLoading(() => {
        // 修正 allVal 的属性顺序
        const allVal = form.getFieldsValue()
        // @ts-ignore
        let _val: SortType = {}
        let key: keyof SortType
        for(key in initialValues) {
            // @ts-ignore
            _val[key] = allVal[key]
        }
        dispatch(sortByForm(_val))
    })

    const rateNode =
        <span>按评分加权
            <Tooltip placement='bottom' title={<ul><li>优先使用用户评分，未评分动画按当前评分计算</li><li>单个作品仅计算评分一次</li></ul>}>
                <ExclamationCircleOutlined style={{ marginLeft: '4px' }}/>
            </Tooltip>
        </span>
    const relationNode =
        <span>职位
            <Tooltip placement='bottom' title={"分类可能存在误判，不一定完全准确"}>
                <ExclamationCircleOutlined style={{ marginLeft: '4px' }}/>
            </Tooltip>
        </span>

    const relationListByDB = useAppSelector(state => state.author.relationListByDB)
    const extraRelationList = relationListByDB.filter(item => !allRelation.includes(item))
    const jobList = plainOptions.map((key) => {
        const relation = jobMap[key]
        if (relation) {
            return {
                label: <Tooltip title={relation.join('，')}>{key}</Tooltip>,
                value: key,
            }
        } else {
            return {
                label: <Tooltip title={extraRelationList.join('，')} open={extraRelationList.length === 0 ? false : undefined}>{key}</Tooltip>,
                value: key,
            }
        }
        
    })

    const [ isTop, containerRef ] = useScrollToTop(0)
    const [ showTopAnime, setShowTopAnime ] = useState(false)

    // dom是否在 transitions 动画。可考虑抽离成独立hook
    useEffect(() => {
        let isAnime = false
        const handleTransitionStart = (e: TransitionEvent | Event) => {
            isAnime = true
        }
        const handleTransitionEnd = (e: TransitionEvent | Event) => {
            isAnime = false
        }
        const domList = [ ...window.document.querySelectorAll('.ant-form-item'), containerRef.current ]
        domList.forEach(dom => {
            dom?.addEventListener('transitionstart', handleTransitionStart)
            dom?.addEventListener('transitionend', handleTransitionEnd)
        })

        setShowTopAnime(isAnime ? false : isTop)

        return () => {
            domList.forEach(dom => {
                dom?.removeEventListener('transitionstart', handleTransitionStart)
                dom?.removeEventListener('transitionend', handleTransitionEnd)
            })
        }
    }, [containerRef, isTop])

    return (
        <Card ref={containerRef} className={`form-card ${ showTopAnime && 'form-card--sticky' }`} bodyStyle={{ padding: 0 }}>
            <Form
                className='select-form'
                {...formItemLayout}
                form={form}
                initialValues={initialValues}
                onValuesChange={onFormChange}
            >
                <Form.Item label="优先级" name="weight">
                    <Radio.Group value={initialValues} >
                        <Radio.Button value={weightType.subject}>创作者/作品</Radio.Button>
                        <Radio.Button value={weightType.relation}>创作者*职位/作品</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label={rateNode} name="useRate" valuePropName='checked'>
                    <Switch />
                </Form.Item>
                <Form.Item label="参与至少" name="subjectCount">
                    <InputNumber addonAfter='部作品' min={1} max={100} style={{ width: '120px' }}/>
                </Form.Item>
                <Form.Item label={relationNode} name="relation">
                    <CheckboxGroup options={jobList} />
                </Form.Item>
                <Form.Item { ...formBtnLayout }>
                    <Button type="primary" htmlType="submit" onClick={onSubmit} style={{ marginRight: '12px' }} loading={loading} icon={<SearchOutlined />}> 
                查询
                    </Button>
                    <Button htmlType="button" onClick={onReset} disabled={resetDisabled}>
                重置
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default AuthorForm
export { weightType, initialValues }
export type { SortType }