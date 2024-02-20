import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectAllProduct = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/laptop/allproduct')
    }, [])
    return (
        <></>
    )
}
export default RedirectAllProduct