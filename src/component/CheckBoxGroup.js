import { Breadcrumb, Row, Col, Checkbox, List, Card } from 'antd';

function CheckBoxGroup({ tittle, nameDisplay, checkedList, handleCheckboxChange, handleSelectAllChange, type, param, isCheckedAll }) {
    const CheckboxGroup = Checkbox.Group;
    const checkedListToString = checkedList.join(',')
    return (
        <>
            <h3 className='font-bold my-4'>{tittle}</h3>
            <div className="checkbox-section">
                <Checkbox
                    className='checkbox-allproduct w-full mb-1'
                    checked={nameDisplay.length === checkedList.length || isCheckedAll}
                    onChange={(e) => handleSelectAllChange(e)}>
                    Tất cả
                </Checkbox>
                <CheckboxGroup
                    className='checkbox-allproduct'
                    value={checkedList} onChange={(e) => handleCheckboxChange(e)}
                >
                    <Row>
                        {tittle === 'Hãng sản xuất' ? type.map((data) => (
                            <Col span={12} className='my-1'>
                                {/* <Link to={`../laptop/brand=${checkedListToString}`}> */}
                                <Checkbox value={data.slug}>{data.name}</Checkbox>

                                {/* </Link> */}
                            </Col>
                        )) : type.map((data) => (
                            <Col span={24} className='my-1'>
                                <Checkbox value={data.slug}>{data.name}</Checkbox>
                            </Col>))}
                    </Row>
                </CheckboxGroup>

            </div>
        </>
    )
}
export default CheckBoxGroup;