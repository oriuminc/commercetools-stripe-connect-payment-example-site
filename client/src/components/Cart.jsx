import React from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useLocalizedString } from "../hooks/useLocalizedString";
import { useFormattedPrice } from "../hooks/useFormattedPrice";

export default function Cart(props) {
  const { getFormattedPrice } = useFormattedPrice();
  const { getLocalizedString } = useLocalizedString();
  const currentLocale = useSelector((state) => state.locale.locale);
  const currentCurrency = useSelector((state) => state.locale.currency);

  return (
    <>
      {props.cart && (
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
                      {getLocalizedString(item.name)}
                    </span>
                    <span>
                      <FormattedMessage
                        id="label.productUnitPrice"
                        defaultMessage={"Unit price"}
                      />
                      :&nbsp;
                      {getFormattedPrice(
                        item.price.value,
                        currentLocale.split("-")[1],
                        currentCurrency
                      )}
                    </span>
                    <span>
                      <FormattedMessage
                        id="label.quantityShort"
                        defaultMessage={"Qty"}
                      />
                      :&nbsp;{item.quantity}
                    </span>
                  </div>
                </div>
                <div>
                  {getFormattedPrice(
                    item.price.value,
                    currentLocale.split("-")[1],
                    currentCurrency,
                    item.quantity
                  )}
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="flex flex-row justify-between">
              <span>
                <FormattedMessage
                  id="label.subtotal"
                  defaultMessage={"Subtotal"}
                />
              </span>
              <span>
                {getFormattedPrice(
                  props.cart.totalPrice,
                  currentLocale.split("-")[1],
                  currentCurrency
                )}
              </span>
            </div>
          </div>
        </div>
      )}
      {!props.cart && (
        <div className="row">
          <FormattedMessage
            id="label.emptyCart"
            defaultMessage={"Your cart is empty"}
          />
        </div>
      )}
    </>
  );
}
