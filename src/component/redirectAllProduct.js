import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectAllProduct = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/laptop/page=1')
    }, [])
    return (
        <></>
    )
}
export default RedirectAllProduct