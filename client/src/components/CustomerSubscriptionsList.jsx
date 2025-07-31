import React, { useState } from "react";
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
import { Spinner } from "./Spinner";
import {
  deleteCustomerSubscription,
  updateCustomerSubscription,
} from "../store/customerSlice";
import { LOCALE_FORMAT_OPTIONS } from "../utils";

const CustomerSubscriptionsList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [updatedOptions, setUpdatedOptions] = useState(null);
  const [manageAction, setManageAction] = useState(null);
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

  const onUpdateSubscriptionHandler = () => {
    dispatch(
      updateCustomerSubscription({
        customerId,
        subscriptionId: selectedSubscription.id,
        updateData: {
          ...updatedOptions,
          subscriptionItemId: selectedSubscription.details.subscriptionItemId,
        },
      })
    );
    setShowUpdateModal(false);
    setShowToast(true);
  };

  const onCloseUpdateModalHandler = () => {
    setShowUpdateModal(false);
    setUpdatedOptions(null);
  };

  const onCloseToastHandler = () => {
    setShowToast(false);
    setManageAction(null);
    setSelectedSubscription(null);
    setUpdatedOptions(null);
  };

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
                  <Card.Title>{element.details.description}</Card.Title>
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
                <p>Information</p>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Below, you can update subscription{" "}
                <span className="font-medium">
                  {selectedSubscription !== null ? selectedSubscription.id : ""}
                </span>
              </p>
              <Form.Group className="mt-3">
                <Form.Label>Select the new quantity</Form.Label>
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
                    Select one option
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
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowUpdateModal(false)}
              >
                <FormattedMessage id="button.abort" defaultMessage={"Abort"} />
              </Button>
              <Button
                variant="primary"
                disabled={!updatedOptions}
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
