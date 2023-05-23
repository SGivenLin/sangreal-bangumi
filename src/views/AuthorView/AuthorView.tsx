import { useSelector } from 'react-redux'
import type { RootState } from 'src/store'

function AuthorView() {
    const collectionList = useSelector((state: RootState) => state.collection.collectionList)

    return (<div>
       {collectionList.map(item => <div key={item.subject_id }>{ item.subject_id }</div>) }
    </div>)
}

export default AuthorView