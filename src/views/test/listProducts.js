import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './listProducts.scss'

class ListProducts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: {
                name: '',
                author: ''
            }
        };
    }

    deleteProduct = (product) => {
        console.log(product)
    }
    render() {
        let { arrProducts, deleteProduct, editProduct, editArrProducts, editInputAuthor, editInputName, saveProduct } = this.props
        let isEmptyArr = editArrProducts.length === 0
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Mã sách</th>
                            <th>Tên sách</th>
                            <th>Tên tác giả</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrProducts.map((product) => {
                            return <tr key={product.id}>
                                <td>{product.id}</td>
                                <>
                                    {isEmptyArr ?
                                        // {product.id ===}
                                        <>
                                            <td>{product.name}</td>
                                            <td>{product.author}</td>
                                        </>
                                        :
                                        <>
                                            {editArrProducts.id === product.id ?
                                                <>
                                                    <td>
                                                        <input defaultValue={product.name} onChange={(e) => editInputName(e)}></input>
                                                    </td>
                                                    <td>
                                                        <input defaultValue={product.author} onChange={(e) => editInputAuthor(e)}></input>
                                                    </td>
                                                </>
                                                :
                                                <>
                                                    <td>{product.name}</td>
                                                    <td>{product.author}</td>
                                                </>
                                            }
                                        </>
                                    }
                                </>
                                <td >
                                    {/* <input></input> */}
                                    <>
                                        {isEmptyArr === false && product.id === editArrProducts.id ?

                                            <button onClick={() => { saveProduct(product) }}>lưu</button>
                                            :
                                            <button onClick={() => { editProduct(product) }}>chỉnh sửa</button>
                                        }
                                    </>
                                    <button onClick={() => { deleteProduct(product.id) }}>xóa</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>

            </div>
        )
    }
}

export default ListProducts