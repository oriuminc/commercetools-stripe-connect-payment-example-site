import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom/cjs/react-router-dom'
import {DEV_REQUEST_HEADERS, updateCartShippingAddress} from "../utils"
import { Spinner } from './Spinner';
const BACKEND_URL = process.env.REACT_APP_BASE_URL;


function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Success = () => {

    const { capture_method} = useParams();

    const [chargeId, setChargeId] = useState(null)

    const [paymentIntentStatus, setPaymentIntentStatus] = useState("")

    const query = useQuery()

    const [isRefunded , setIsRefunded] = useState(false)

    const isCaptured = paymentIntentStatus === "succeeded"
    const isCanceled = paymentIntentStatus === "canceled"

    const [{
        isCapturing,
        isCanceling,
        isRefunding
    }, setFetchingState] = useState({
        isCapturing : false,
        isCanceling : false,
        isRefunding : false
    })

    const getPaymentIntent = async () => {
        const payment_intent_id = query.get("payment_intent")

        let response = await fetch(`${BACKEND_URL}/payment-intent/${payment_intent_id}`,
            {
                headers:{
                    ...DEV_REQUEST_HEADERS
                }
            }
        )
        const payment_intent = await response.json()
    
        setPaymentIntentStatus(payment_intent.status)
        setChargeId(payment_intent.latest_charge)
        updateChargeObject()
    }

    const updateChargeObject = async () => {
        if (!chargeId) return;

        let response = await fetch(`${BACKEND_URL}/charge/${chargeId}`,
            {
                headers : {
                    ...DEV_REQUEST_HEADERS
                }
            }
        )

        const charge = await response.json()

        console.log(charge);

        setIsRefunded(charge.refunded)
    }

    useEffect(() => {
        getPaymentIntent()
    },[])

    useEffect(() => {
        updateChargeObject()
    },[chargeId])

    useEffect(() => {
        const id = query.get("cart_id")
        
        fetch(`${BACKEND_URL}/create-order/`,
            {
                method : "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...DEV_REQUEST_HEADERS
                },
                body : JSON.stringify({id})    
            }
        )
        .catch(res => console.error(res))
    },[])
    
    useEffect(() => {
        if(capture_method === "manual") return;
        
        const payment_intent = query.get("payment_intent");

        const asyncCall = async () => {

            let {latest_charge} = await fetch(`${BACKEND_URL}/payment-intent/${payment_intent}`)
                .then(res => res.json())

            setChargeId(latest_charge)
        }
        
        asyncCall()
    },[query])

    const requestRefund = async () => {

        setFetchingState(prev => ({...prev, isRefunding : true}))

        await fetch(`${BACKEND_URL}/request-refund/`,
            {
                method : "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...DEV_REQUEST_HEADERS
                },
                body: JSON.stringify({chargeId})
            }
        ).then(res => res.json())
        .catch(_ =>  setFetchingState(prev => ({...prev, isRefunding : false})))

        await getPaymentIntent()
        
        setFetchingState(prev => ({...prev, isCapturing : false}))
    }
    
    const cancelPayment = async () => {

        const payment_intent = query.get("payment_intent")
        setFetchingState(prev => ({...prev, isCanceling : true}))
        
        let response = await fetch(`${BACKEND_URL}/cancel-payment/`,
            {
                method : "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...DEV_REQUEST_HEADERS
                },
                body: JSON.stringify({payment_intent})
            }
        ).then(res => res.json())
        .catch(res => setFetchingState(prev => ({...prev, isCanceling : false})))   
        
        await getPaymentIntent()
        setFetchingState(prev => ({...prev, isCanceling : false}))
                
    }
    
    const capture = async () => {
        const payment_intent = query.get("payment_intent")
        setFetchingState(prev => ({...prev, isCapturing : true}))
        let {latest_charge} = await fetch(`${BACKEND_URL}/capture-payment/`,
            {
                method : "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...DEV_REQUEST_HEADERS
                },
                body: JSON.stringify({payment_intent})
            }
        ).then(res => res.json()) 
        .catch(_ => setFetchingState(prev => ({...prev, isCapturing : false})))

        setChargeId(latest_charge)
        await getPaymentIntent()
        setFetchingState(prev => ({...prev, isCapturing : false}))
    }

    return (
        <>
        <p>
            Your order has been registered!
        </p>

        {
            isRefunded && !isCanceled &&
            "The payment is Refunded"
        }

        {
            isCanceled?
            "The payment is canceled"
                :
            !isRefunded &&
            `The payment ${!isCaptured ? "needs to be captured" : "is captured"}`
        }
            <div className='flex gap-4 pt-4'>

                {
                    !isCaptured && !isCanceled && !isRefunded &&
                    <button onClick={capture} className={`${!isCapturing ? "border-[#635bff] text-[#635bff]" : "border-[#9d9dad] text-[#9d9dad]"} px-3 py-2 rounded-md font-medium border-2 `}>
                        {isCapturing ? 
                            <Spinner />
                            :
                            "Capture"
                        }
                    </button>
                }
                {
                    (isCaptured || capture_method !== "manual") && !isRefunded &&
                    <button onClick={requestRefund} className={`${!isCanceling ? "border-[#635bff] text-[#635bff]" : "text-[#9d9dad] border-[#9d9dad]"} px-3 py-2 rounded-md font-medium border-2`}>
                        {isRefunding ? 
                            <Spinner />
                            :
                            "Request Refund"
                        }
                    </button>
                }
                {
                    !isCanceled && capture_method === "manual" && !isCaptured &&
                    <button onClick={cancelPayment} className={`${!isCanceling ? "bg-[#ec1313]" : "bg-[#9d9dad]"} px-3 py-2 rounded-md text-white font-medium`}>
                        {isCanceling ? 
                            <Spinner />
                            :
                            "Cancel Payment Authorization"
                        }
                    </button>
                }
                
            </div>
        </>
    )
}

export default Success