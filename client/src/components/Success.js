import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom/cjs/react-router-dom'
const BACKEND_URL = process.env.REACT_APP_BASE_URL;


function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Success = () => {

    const { capture_method, ...rest } = useParams();

    const [chargeId, setChargeId] = useState(null)

    const query = useQuery()
    
    useEffect(() => {
        const id = query.get("cart_id")

        
        fetch(`${BACKEND_URL}/create-order/`,
            {
                method : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({id})    
            }
        ).then(res => res.json())
        .then(res => console.log(res))
    },[])
    
    useEffect(() => {
        if(capture_method === "manual") return;
        
        const payment_intent = query.get("payment_intent");

        const asyncCall = async () => {

            let {latest_charge, ...rest} = await fetch(`${BACKEND_URL}/payment-intent/${payment_intent}`)
                .then(res => res.json())

            setChargeId(latest_charge)
        }
        
        asyncCall()
    },[query])

    const requestRefund = async () => {

        fetch(`${BACKEND_URL}/request-refund/`,
            {
                method : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({chargeId})
            }
        ).then(res => res.json())
        .then(res =>  console.log(res))
    }
    
    const cancelPayment = () => {
        const payment_intent = query.get("payment_intent")
        
        fetch(`${BACKEND_URL}/cancel-payment/`,
            {
                method : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({payment_intent})
            }
        ).then(res => res.json())
        .then(res =>  console.log(res))   
    }
    
    const capture = async () => {
        const payment_intent = query.get("payment_intent")
        let {latest_charge} = await fetch(`${BACKEND_URL}/capture-payment/`,
            {
                method : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({payment_intent})
            }
        ).then(res => res.json()) 
        
        setChargeId(latest_charge)
    }

    return (
        <div className='flex gap-4'>
            {
                capture_method === "manual" &&
                <button onClick={capture} className='px-3 py-2 rounded-md font-medium border-2 border-[#635bff] text-[#635bff]'>
                    Capture
                </button>
            }
            {
                (chargeId || capture_method !== "manual") &&
                <button onClick={requestRefund} className='px-3 py-2 rounded-md font-medium border-2 border-[#635bff] text-[#635bff]'>
                    Request Refund
                </button>
            }
            {
                capture_method === "manual" &&
                <button onClick={cancelPayment} className='px-3 py-2 rounded-md bg-[#ec1313] text-white font-medium'>
                    Cancel Payment
                </button>
            }
            
        </div>
    )
}

export default Success