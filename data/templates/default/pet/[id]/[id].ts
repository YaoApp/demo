// [id].ts
import { EventData, Component, EventDetail } from "@yao/sui";
const self = this as Component;

self.goBack = () => {
  window.location.href = `/`;
};
