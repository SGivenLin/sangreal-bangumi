import { Form, Radio, InputNumber, Switch, Tooltip, Checkbox } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from 'src/store';
import { sortByForm } from 'src/store/author'
import { jobMap } from 'src/lib/const'

const CheckboxGroup = Checkbox.Group;

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

const plainOptions = Object.keys(jobMap)
const initialValues: SortType = {  relation: plainOptions, subjectCount: 2, weight: weightType.subject, useRate: false }
const AuthorForm: React.FC = () => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch()

    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 12 } }
    const onFormChange = (val: Partial<SortType>, allVal: SortType) => {
        // 修正 allVal 的属性顺序
        // @ts-ignore
        let _val: SortType = {}
        let key: keyof SortType
        for(key in initialValues) {
            // @ts-ignore
            _val[key] = allVal[key]
        }
        dispatch(sortByForm(_val))
    };

    const rateDom =
        <span>按评分加权
            <Tooltip placement='bottom' title={<ul><li>优先使用用户评分，未评分动画按当前评分计算</li><li>单个作品仅计算评分一次</li></ul>}>
                <ExclamationCircleOutlined style={{ marginLeft: '4px' }}/>
            </Tooltip>
        </span>
    return (
        <Form
            className='author-form'
            {...formItemLayout}
            form={form}
            initialValues={initialValues}
            onValuesChange={onFormChange}
        >
            <Form.Item label="优先级" name="weight">
                <Radio.Group value={initialValues} >
                    <Radio.Button value={weightType.relation}>创作者*职位/作品</Radio.Button>
                    <Radio.Button value={weightType.subject}>创作者/作品</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label={rateDom} name="useRate" valuePropName='checked'>
                <Switch />
            </Form.Item>
            <Form.Item label="参与至少" name="subjectCount">
                <InputNumber addonAfter='部作品' min={1} max={100} style={{ width: '120px' }}/>
            </Form.Item>
            <Form.Item label="职位" name="relation">
                <CheckboxGroup options={plainOptions} />
            </Form.Item>
        </Form>
    );
};

export default AuthorForm;
export { weightType, initialValues }
export type { SortType }