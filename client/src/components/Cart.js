import React from "react";

export default function Cart(props) {

  const displayPrice = (amount) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: props.currency,
    });
  };
  console.log(props.cart)

  return (
    <>
      {props.cart && 
        <div className="flex flex-col gap-8 bg-white drop-shadow-lg rounded-md p-6">
          <div className="flex flex-col gap-3  after:content-[''] after:h-px after:w-full">
            {props.cart?.lineItems?.map?.((item, key) => (
              <div className="flex flex-row justify-between" key={key}>
                <div className="flex flex-row gap-3">
                  <img
                    className="h-20 w-auto aspect-square rounded-md"
                    alt="shopping cart item"
                    src={item.variant.images[0]?.url}
                  />
                  <div className="flex flex-col gap-3">
                    <span className="font-bold">
                      {item.name["en-US"]}
                    </span>
                    <span>
                      Unit price ${displayPrice(
                        (item.price.value.centAmount / Math.pow(10, item.price.value.fractionDigits)).toFixed(
                          item.price.value.fractionDigits
                        )
                      )}
                    </span>
                    <span>
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <div>
                  ${displayPrice(
                    (item.totalPrice.centAmount / Math.pow(10, item.totalPrice.fractionDigits)).toFixed(
                      item.price.value.fractionDigits
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="flex flex-row justify-between">
              <span>
                Subtotal
              </span>
              <span>
                ${props.cart.totalPrice.centAmount / Math.pow(10, 2)}
              </span>
            </div>
          </div>
        </div>
      }
      {!props.cart && <div className="row">Your cart is empty</div>}
    </>
  );
}
