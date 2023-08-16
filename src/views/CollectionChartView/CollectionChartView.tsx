import { type FC } from 'react'
import './CollectionChartView.styl'
import { Card } from 'antd'
import CollectionRateChart from 'src/component/Charts/CollectionRate'

const CollectionChartView: FC = () => {
    return <Card>
        <Card title="评分分布" bodyStyle={{ paddingTop: 8 }}>
            <CollectionRateChart></CollectionRateChart>
        </Card>
    </Card>
}

export default CollectionChartView