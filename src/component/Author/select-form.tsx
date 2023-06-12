import { Form, Radio, InputNumber  } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from 'src/store';
import { sortByForm } from 'src/store/author';

enum weightType {
    relation,
    subject
}

interface SortType {
    weight: weightType,
    subjectCount: number
}

const initialValues = { weight: weightType.subject, subjectCount: 1 }
const AuthorForm: React.FC = () => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch()

    const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 12 } }
    const onFormChange = (val: Partial<SortType>, allVal: SortType) => {
        dispatch(sortByForm(allVal))
    };

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
            <Form.Item label="参与至少" name="subjectCount">
                <InputNumber addonAfter='部作品' min={1} max={100} style={{ width: '120px' }}/>
            </Form.Item>
        </Form>
    );
};

export default AuthorForm;
export { weightType, initialValues }
export type { SortType }