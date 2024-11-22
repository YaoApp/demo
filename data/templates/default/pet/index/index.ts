import { EventData, Component, EventDetail } from "@yao/sui";
const self = this as Component;

self.viewDetails = (event: Event, data: EventData, detail: EventDetail) => {
  const petId = data["id"];
  window.location.href = `/pet/${petId}`;
};
