import React from 'react'
import { useParams } from 'react-router-dom/cjs/react-router-dom'

const Success = () => {

    const { capture_method } = useParams();

    return (
        <div>
            Capture method : {capture_method}
        </div>
    )
}

export default Success