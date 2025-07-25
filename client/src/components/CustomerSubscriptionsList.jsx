import React, { useEffect } from "react";
import { FormattedDate, FormattedMessage, FormattedNumber } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import CustomToggle from "./AccordionCustomToogle";
import { Spinner } from "./Spinner";
import { fetchCustomerSubscription } from "../store/customerSlice";
import { LOCALE_FORMAT_OPTIONS } from "../utils";

const CustomerSubscriptionsList = () => {
  const customerId = useSelector((state) => state.customer.customerId);
  const isLoading = useSelector((state) => state.customer.isFetchingData);
  const subscriptions = useSelector(
    (state) => state.customer.customerSubscriptions
  );
  const dispatch = useDispatch();

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
        return "bg-blue-300";
    }
  };

  const getCollectionMethodLabel = (method) => {
    switch (method) {
      case "charge_automatically":
        return "Charge Automatically";
      case "send_invoice":
        return "Send Invoice";
      default:
        return "Unknown Method";
    }
  };

  useEffect(
    () => dispatch(fetchCustomerSubscription(customerId)),
    [customerId, dispatch]
  );

  return isLoading ? (
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
      No subscriptions
    </div>
  ) : (
    <Row>
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
                  <span className="text-current font-normal">{element.id}</span>
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
                    Recurrence:&nbsp;
                    <Badge
                      pill
                      className={`rounded-full px-3 py-1 text-sm font-medium capitalize bg-indigo-400`}
                    >
                      {element.recurrence}
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
                      defaultMessage={"Qty:"}
                    />
                    :&nbsp;
                    <span className="text-current font-normal">
                      {element.details.quantity}
                    </span>
                  </p>
                  <p className="font-semibold">
                    <FormattedMessage
                      id="label.status"
                      defaultMessage={"Status:"}
                    />
                    :&nbsp;
                    <Badge
                      pill
                      className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getBadgeColorStatus(
                        element.status
                      )}`}
                    >
                      {element.status}
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
                                value={element.details.period.startDate * 1000}
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
                                value={element.details.period.endDate * 1000}
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
                                value={element.details.amountRemaining / 100}
                                currency={element.details.currency}
                                {...LOCALE_FORMAT_OPTIONS}
                              />
                            </span>
                          </p>
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
    </Row>
  );
};

export default CustomerSubscriptionsList;
