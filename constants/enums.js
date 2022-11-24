const inputTypes = {
  values: {
    text: "text",
    phone: "phone",
    email: "email",
    select: "select",
    checkbox: "checkbox",
    dateTime: "dateTime",
    number: "number",
    address: "address",
    time: "time",
  },
  message: "Input type is incorrect.",
};

const roles = {
  values: { tech: "tech", owner: "owner" },
  message: "Input type is incorrect.",
};

const days = {
  values: {
    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
    Saturday: "Saturday",
    Sunday: "Sunday",
  },
  message: "Incorrect day name",
};

const eventTypes = {
  values: { request: "Request", estimate: "Estimate", booking: "Booking" },
  message: "Incorrect event type",
};

const eventStatus = {
  values: {
    received: "Received",
    pending: "Pending",
    confirmed: "Confirmed",
    rejected: "Rejected",
  },
  message: "Incorrect event status",
};

const employeeRoles = {
  helper: "helper",
  driver: "driver",
  crewLead: "crewLead",
};

module.exports = {
  inputTypes,
  roles,
  days,
  eventTypes,
  eventStatus,
  employeeRoles,
};
