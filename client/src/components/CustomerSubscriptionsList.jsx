import React, { useState, useEffect } from "react";
import {
  FormattedDate,
  FormattedMessage,
  FormattedNumber,
  useIntl,
} from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import CustomToggle from "./AccordionCustomToogle";
import SwitchSelector from "react-switch-selector";
import { Spinner } from "./Spinner";
import {
  deleteCustomerSubscription,
  patchCustomerSubscription,
  updateCustomerSubscription
} from "../store/customerSlice";
import { LOCALE_FORMAT_OPTIONS, COMMON_COLOURS } from "../utils";
import { useApi } from "../hooks/useApi";

const CustomerSubscriptionsList = ({ currency }) => {
  const { getSubscriptionProducts } = useApi();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [updatedOptions, setUpdatedOptions] = useState(null);
  const [updatedProductSku, setUpdatedProductSku] = useState(null);
  const [subscriptionProducts, setSubscriptionProducts] = useState([]);
  const [manageAction, setManageAction] = useState(null);
  const [areAllInformationCorrect, setAreAllInformationCorrect] =
    useState(false);
  const isLoading = useSelector((state) => state.customer.isFetchingData);
  const requestHadError = useSelector(
    (state) => state.customer.requestHadError
  );
  const customerId = useSelector((state) => state.customer.customerId);
  const subscriptions = useSelector(
    (state) => state.customer.customerSubscriptions
  );
  const dispatch = useDispatch();
  const intl = useIntl();

  const switchSelectorOptions = [
  {
    label: intl.formatMessage({
      id: "label.quantity",
      defaultMessage: "Quantity",
    }),
    selectedBackgroundColor: COMMON_COLOURS[0].hexCode,
    value: true,
  },
  {
    label: intl.formatMessage({
      id: "label.product",
      defaultMessage: "Product",
    }),
    selectedBackgroundColor: COMMON_COLOURS[1].hexCode,
    value: false,
  },
];

  const getBadgeColorStatus = (status) => {
    switch (status) {
      case "active":
        return "bg-green-600";
      case "incomplete":
        return "bg-yellow-300 text-zinc-500";
      case "canceled":
        return "bg-zinc-400";
      case "past_due":
        return "bg-orange-400 text-zinc-500";
      case "unpaid":
        return "bg-red-500";
      default:
        return "bg-amber-600";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return intl.formatMessage({
          id: "label.subscriptionStatusActive",
          defaultMessage: "Active",
        });
      case "canceled":
        return intl.formatMessage({
          id: "label.subscriptionStatusCanceled",
          defaultMessage: "Canceled",
        });
      case "incomplete":
        return intl.formatMessage({
          id: "label.subscriptionStatusIncomplete",
          defaultMessage: "Incomplete",
        });
      case "past_due":
        return intl.formatMessage({
          id: "label.subscriptionStatusPastDue",
          defaultMessage: "Past Due",
        });
      case "trialing":
        return intl.formatMessage({
          id: "label.subscriptionStatusTrialing",
          defaultMessage: "Trialing",
        });
      case "unpaid":
        return intl.formatMessage({
          id: "label.subscriptionStatusUnpaid",
          defaultMessage: "Unpaid",
        });
      default:
        return intl.formatMessage({
          id: "label.subscriptionStatusUnknown",
          defaultMessage: "Unknown",
        });
    }
  };

  const getRecurrenceLabel = (recurrence) => {
    switch (recurrence) {
      case "month":
        return intl.formatMessage({
          id: "button.monthlySubscription",
          defaultMessage: "Monthly",
        });
      case "year":
        return intl.formatMessage({
          id: "button.yearlySubscription",
          defaultMessage: "Yearly",
        });
      default:
        return intl.formatMessage({
          id: "label.noInformation",
          defaultMessage: "No information available",
        });
    }
  };

  const getCollectionMethodLabel = (method) => {
    switch (method) {
      case "charge_automatically":
        return intl.formatMessage({
          id: "label.chargeAutomatically",
          defaultMessage: "Charge automatically",
        });
      case "send_invoice":
        return intl.formatMessage({
          id: "label.chargeSendInvoice",
          defaultMessage: "Send invoice",
        });
      default:
        return intl.formatMessage({
          id: "label.chargeUnknown",
          defaultMessage: "Unknown method",
        });
    }
  };

  const toastBody = {
    delete: () =>
      requestHadError ? (
        <FormattedMessage
          id="label.userDeleteSubscriptionError"
          defaultMessage={"There was an error deleting the subscription."}
        />
      ) : (
        <FormattedMessage
          id="label.userDeleteSubscriptionSuccess"
          defaultMessage={"Subscription deleted successfully."}
        />
      ),
    update: () =>
      requestHadError ? (
        <FormattedMessage
          id="label.userUpdateSubscriptionError"
          defaultMessage={"There was an error updating the subscription."}
        />
      ) : (
        <FormattedMessage
          id="label.userUpdateSubscriptionSuccess"
          defaultMessage={"Subscription updated successfully."}
        />
      ),
  };

  const onClickDeleteSubscriptionHandler = (subscription) => {
    setShowDeleteModal(true);
    setSelectedSubscription(subscription);
    setManageAction("delete");
  };

  const onDeleteSubscriptionHandler = () => {
    dispatch(
      deleteCustomerSubscription({
        customerId,
        subscriptionId: selectedSubscription.id,
      })
    );
    setShowDeleteModal(false);
    setShowToast(true);
  };

  const onClickUpdateSubscriptionHandler = (subscription) => {
    setShowUpdateModal(true);
    setSelectedSubscription(subscription);
    setManageAction("update");
  };

  const onSwitchUpdateValue = () => {
    setUpdateQuantity(!updateQuantity);
  }

  const onUpdateSubscriptionHandler = () => {
    if (updateQuantity) {
      dispatch(
        patchCustomerSubscription({
          customerId,
          subscriptionId: selectedSubscription.id,
          updateData: {
            ...updatedOptions,
            subscriptionItemId: selectedSubscription.details.subscriptionItemId,
          },
        })
      );
    } else {
      const newVariant = subscriptionOptions.find(variant => variant.sku === updatedProductSku);
      const newVariantId = newVariant.id;
      const newPriceId = (newVariant.prices.find(price => price.value.currencyCode === currency)).id;
      const newProductId = newVariant.productId;
      dispatch(
        updateCustomerSubscription({
          customerId,
          subscriptionId: selectedSubscription.id,
          newProductId,
          newVariantId,
          newPriceId,
        })
      );
    }
    setShowUpdateModal(false);
    setShowToast(true);
    setUpdatedOptions(null);
    setUpdatedProductSku(null);
    setUpdateQuantity(true);
    setAreAllInformationCorrect(false);
  };

  const onCloseUpdateModalHandler = () => {
    setShowUpdateModal(false);
    setUpdatedOptions(null);
    setUpdatedProductSku(null);
    setUpdateQuantity(true);
    setAreAllInformationCorrect(false);
  };

  const onCloseToastHandler = () => {
    setShowToast(false);
    setManageAction(null);
    setSelectedSubscription(null);
    setUpdatedOptions(null);
  };

  const getProductVariants = (product) => {
    return [...product.masterData.current.variants,
    ...(product.masterData.current.masterVariant ? [product.masterData.current.masterVariant] : [])].map((variant) => ({
      ...variant,
      productId: product.id,
      productName: product.masterData.current.name[intl.locale] || product.masterData.current.name["en"] || "Unnamed Product",
      price: variant.prices.find(price => price.value.currencyCode === currency)
    }));
  }

  const fetchSubscriptionProducts = async () => {
    const products = await getSubscriptionProducts(currency);
    setSubscriptionProducts(products);
  };

  useEffect(() => {
    fetchSubscriptionProducts();
  }, []);

  const subscriptionOptions = subscriptionProducts.map(getProductVariants).flat();

  return (
    <>
      {isLoading ? (
        <div className="w-100 h-100 flex flex-column justify-content-start align-items-center">
          <p className="text-lg mb-8">
            <FormattedMessage
              id="label.loadingFallback"
              defaultMessage={"Loading, please wait…"}
            />
          </p>
          <Spinner width="16%" height="16%" />
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="flex items-start justify-center h-full">
          <p className="text-xl font-medium">
            <FormattedMessage
              id="label.userNoSubscriptions"
              defaultMessage={"No subscriptions"}
            />
          </p>
        </div>
      ) : (
        <Row ms={2} lg={3} className="justify-content-center">
          {subscriptions.map((element) => (
            <Col key={element.id} className="mb-4">
              <Card className="shadow-md">
                <Card.Body>
                  <Card.Title>{element.details.title}</Card.Title>
                  <Card.Text as="div" className="flex flex-col gap-[0.8rem]">
                    <p className="font-semibold inline-flex flex-col">
                      <FormattedMessage
                        id="label.subscriptionId"
                        defaultMessage={"Subscription ID"}
                      />
                      :&nbsp;
                      <span className="text-current font-normal">
                        {element.id}
                      </span>
                    </p>
                    <div className="flex align-items-center justify-start gap-4">
                      <p className="font-semibold inline-flex flex-col">
                        <FormattedMessage
                          id="label.collectionMethod"
                          defaultMessage={"Collection Method"}
                        />
                        :&nbsp;
                        <span className="text-current font-normal">
                          {getCollectionMethodLabel(element.collectionMethod)}
                        </span>
                      </p>
                      <p className="font-semibold inline-flex flex-col">
                        <FormattedMessage
                          id="label.recurrence"
                          defaultMessage={"Recurrence"}
                        />
                        :&nbsp;
                        <Badge
                          pill
                          className={`rounded-full px-3 py-1 text-sm font-medium capitalize bg-indigo-400`}
                        >
                          {getRecurrenceLabel(element.recurrence)}
                        </Badge>
                      </p>
                    </div>
                    <div className="flex align-items-center justify-start gap-4">
                      <p className="font-semibold inline-flex flex-col">
                        <FormattedMessage
                          id="label.startDate"
                          defaultMessage={"Start date"}
                        />
                        :&nbsp;
                        <span className="text-current font-normal">
                          <FormattedDate
                            value={element.startDate * 1000}
                            year="numeric"
                            month="long"
                            day="2-digit"
                          />
                        </span>
                      </p>
                      <p className="font-semibold inline-flex flex-col">
                        <FormattedMessage
                          id="label.endDate"
                          defaultMessage={"End date"}
                        />
                        :&nbsp;
                        <span className="text-current font-normal">
                          {element.endDate !== null ? (
                            <FormattedDate
                              value={element.endDate * 1000}
                              year="numeric"
                              month="long"
                              day="2-digit"
                            />
                          ) : (
                            "-"
                          )}
                        </span>
                      </p>
                    </div>
                    <div className="flex align-items-center justify-start gap-4">
                      <p className="font-semibold">
                        <FormattedMessage
                          id="label.quantityShort"
                          defaultMessage={"Qty"}
                        />
                        :&nbsp;
                        <span className="text-current font-normal">
                          {element.details.quantity}
                        </span>
                      </p>
                      <p className="font-semibold">
                        <FormattedMessage
                          id="label.status"
                          defaultMessage={"Status"}
                        />
                        :&nbsp;
                        <Badge
                          pill
                          className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getBadgeColorStatus(
                            element.status
                          )}`}
                        >
                          {getStatusLabel(element.status)}
                        </Badge>
                      </p>
                    </div>
                    <Accordion className="mt-3">
                      <Card>
                        <CustomToggle eventKey="0">
                          <FormattedMessage
                            id="label.seeCurrentPeriodDetails"
                            defaultMessage={"See current period details"}
                          />
                        </CustomToggle>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            <p className="text-md font-bold">Current period</p>
                            <div className="flex align-items-center justify-start gap-4">
                              <p className="font-medium inline-flex flex-col">
                                <FormattedMessage
                                  id="label.startDate"
                                  defaultMessage={"Start date"}
                                />
                                :&nbsp;
                                <span className="text-current font-normal">
                                  <FormattedDate
                                    value={
                                      element.details.period.startDate * 1000
                                    }
                                    year="numeric"
                                    month="long"
                                    day="2-digit"
                                  />
                                </span>
                              </p>
                              <p className="font-medium inline-flex flex-col">
                                <FormattedMessage
                                  id="label.endDate"
                                  defaultMessage={"End date"}
                                />
                                :&nbsp;
                                <span className="text-current font-normal">
                                  <FormattedDate
                                    value={
                                      element.details.period.endDate * 1000
                                    }
                                    year="numeric"
                                    month="long"
                                    day="2-digit"
                                  />
                                </span>
                              </p>
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                      <Card>
                        <CustomToggle eventKey="1">
                          <FormattedMessage
                            id="label.seeBillingDetails"
                            defaultMessage={"See billing details"}
                          />
                        </CustomToggle>
                        <Accordion.Collapse eventKey="1">
                          <Card.Body>
                            <p className="text-md font-bold">Payments</p>
                            <div className="flex align-items-center justify-start gap-4">
                              <p className="font-medium inline-flex flex-col">
                                <FormattedMessage
                                  id="label.amountDue"
                                  defaultMessage={"Amount due"}
                                />
                                :&nbsp;
                                <span className="text-current font-normal">
                                  <FormattedNumber
                                    value={element.details.amountDue / 100}
                                    currency={element.details.currency}
                                    {...LOCALE_FORMAT_OPTIONS}
                                  />
                                </span>
                              </p>
                              <p className="font-medium inline-flex flex-col">
                                <FormattedMessage
                                  id="label.amountRemaining"
                                  defaultMessage={"Amount remaining"}
                                />
                                :&nbsp;
                                <span className="text-current font-normal">
                                  <FormattedNumber
                                    value={
                                      element.details.amountRemaining / 100
                                    }
                                    currency={element.details.currency}
                                    {...LOCALE_FORMAT_OPTIONS}
                                  />
                                </span>
                              </p>
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                      <Card>
                        <CustomToggle eventKey="2">
                          <FormattedMessage
                            id="label.userManageSubscription"
                            defaultMessage={"Manage subscription"}
                          />
                        </CustomToggle>
                        <Accordion.Collapse eventKey="2">
                          <Card.Body>
                            <div className="flex justify-content-evenly">
                              <Button
                                variant="outline-danger"
                                onClick={() =>
                                  onClickDeleteSubscriptionHandler(element)
                                }
                              >
                                <FormattedMessage
                                  id="button.cancel"
                                  defaultMessage={"Cancel"}
                                />
                              </Button>
                              <Button
                                variant="outline-primary"
                                onClick={() =>
                                  onClickUpdateSubscriptionHandler(element)
                                }
                              >
                                <FormattedMessage
                                  id="button.update"
                                  defaultMessage={"Update"}
                                />
                              </Button>
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton className="text-3xl">
              <Modal.Title>
                <FormattedMessage
                  id="label.warning"
                  defaultMessage={"Warning"}
                />
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                <FormattedMessage
                  id="label.userDeleteSubscriptionWarning"
                  defaultMessage={
                    "Are you sure you want to delete the subscription with ID {id}? This action cannot be undone."
                  }
                  values={{
                    id:
                      selectedSubscription !== null
                        ? selectedSubscription.id
                        : "",
                  }}
                />
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                <FormattedMessage id="button.abort" defaultMessage={"Abort"} />
              </Button>
              <Button variant="danger" onClick={onDeleteSubscriptionHandler}>
                <FormattedMessage
                  id="button.confirm"
                  defaultMessage={"Confirm"}
                />
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showUpdateModal}
            onHide={onCloseUpdateModalHandler}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton className="text-3xl">
              <Modal.Title>
                <FormattedMessage
                  id="label.information"
                  defaultMessage={"Information"}
                />
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex align-items-center justify-content-between gap-2">
                <div>
                  <FormattedMessage
                    id="label.userUpdateSubscriptionLabel"
                    defaultMessage={"Below, you can update the subscription"}
                  />{" "}
                  <div className="font-medium">
                    {selectedSubscription !== null ? selectedSubscription.id : ""}
                  </div>
                </div>
                <div className="flex-auto">
                  <SwitchSelector
                    name="update-options-switch"
                    onChange={onSwitchUpdateValue}
                    options={switchSelectorOptions}
                    initialSelectedIndex={0}
                    fontSize={15}
                  />
                </div>
              </div>
              {updateQuantity ? (
                <Form.Group className="my-3">
                  <Form.Label>
                    <FormattedMessage
                      id="label.selectNewQuantity"
                      defaultMessage={"Select the new quantity"}
                    />
                  </Form.Label>
                  <Form.Control
                    as="select"
                    className="cursor-pointer"
                    defaultValue={""}
                    onChange={(e) => {
                      setUpdatedOptions({
                        ...updatedOptions,
                        quantity: e.target.value,
                      });
                    }}
                  >
                    <option disabled value={""}>
                      {intl.formatMessage({
                        id: "select.selectOption",
                        defaultMessage: "Select an option",
                      })}
                    </option>
                    {Array.from(
                      { length: 5 },
                      (_, i) =>
                        selectedSubscription !== null &&
                        selectedSubscription.details.quantity !== i + 1 && (
                          <option key={`option_${i + 1}`} value={i + 1}>
                            {i + 1}
                          </option>
                        )
                    )}
                  </Form.Control>
                </Form.Group>) : (
                <Form.Group className="my-3">
                  <Form.Label>
                    <FormattedMessage
                      id="label.selectNewProduct"
                      defaultMessage={"Select the new product"}
                    />
                  </Form.Label>
                  <Form.Control
                    as="select"
                    className="cursor-pointer"
                    defaultValue={""}
                    onChange={(e) => {
                      setUpdatedProductSku(e.target.value);
                    }}
                  >
                    <option disabled value={""}>
                      {intl.formatMessage({
                        id: "select.selectOption",
                        defaultMessage: "Select an option",
                      })}
                    </option>
                    {subscriptionOptions && subscriptionOptions.map((variant) => (
                      <option key={variant.sku} value={variant.sku}>
                        {`${variant.productName} (${(Math.round(variant.price.value.centAmount)/100).toFixed(2)} ${variant.price.value.currencyCode} / ${variant.attributes.find(attr => attr.name === "recurring_interval").value.key || "N/A"})`}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}
              <Form>
                <Form.Check
                  id="confirmUpdate"
                  type="checkbox"
                  label={intl.formatMessage({
                    id: "checkbox.allInformationCorrect",
                    defaultMessage:
                      "I confirm that all information is correct.",
                  })}
                  onChange={(e) =>
                    setAreAllInformationCorrect(e.target.checked)
                  }
                />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => onCloseUpdateModalHandler()}
              >
                <FormattedMessage id="button.abort" defaultMessage={"Abort"} />
              </Button>
              <Button
                variant="primary"
                disabled={(updatedOptions === null && updatedProductSku === null) || !areAllInformationCorrect}
                onClick={onUpdateSubscriptionHandler}
              >
                <FormattedMessage
                  id="button.confirm"
                  defaultMessage={"Confirm"}
                />
              </Button>
            </Modal.Footer>
          </Modal>
        </Row>
      )}
      <div
        aria-atomic="true"
        aria-live="polite"
        className="position-fixed top-[4rem] right-[2.4rem]"
      >
        <Toast
          onClose={onCloseToastHandler}
          show={showToast}
          autohide
          delay={4500}
          className={`${requestHadError ? "bg-danger" : "bg-success"}`}
        >
          <Toast.Header closeButton className="text-2xl">
            <strong className="text-lg me-auto">
              {requestHadError ? (
                <FormattedMessage id="label.error" defaultMessage={"Error"} />
              ) : (
                <FormattedMessage
                  id="label.success"
                  defaultMessage={"Success"}
                />
              )}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white font-medium">
            {toastBody[manageAction]?.()}
          </Toast.Body>
        </Toast>
      </div>
    </>
  );
};

export default CustomerSubscriptionsList;
