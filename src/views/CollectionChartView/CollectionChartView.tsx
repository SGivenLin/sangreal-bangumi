import { type FC } from 'react'
import './CollectionChartView.styl'
import { Card } from 'antd'
import CollectionRateChart from 'src/component/Charts/CollectionRate'
import CollectionDateChart from 'src/component/Charts/CollectionDate'

const CollectionChartView: FC = () => {
    return <Card className='collection-charts'>
        <Card title="收藏评分分布" bodyStyle={{ paddingTop: 8 }}>
            <CollectionRateChart></CollectionRateChart>
        </Card>
        <Card title="收藏动画播出年份" bodyStyle={{ paddingTop: 8 }}>
            <CollectionDateChart></CollectionDateChart>
        </Card>
    </Card>
}

export default CollectionChartView