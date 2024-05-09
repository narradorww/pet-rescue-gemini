var ExposedFn;
(function (ExposedFn) {
    ExposedFn["OnMessage"] = "onMessage";
    ExposedFn["OnAck"] = "onAck";
    ExposedFn["OnParticipantsChanged"] = "onParticipantsChanged";
})(ExposedFn || (ExposedFn = {}));
/**
 * Exposes [OnMessage] function
 */
window.WAPI.waitNewMessages(false, (data) => {
    data.forEach((message) => {
        window[ExposedFn.OnMessage](message);
    });
});
// This does not appear to be implemented anywhere right now and is breaking code injection via evaluate instead of addScriptTag
/*
(window as any).WAPI.waitNewAcknowledgements(function (data: any) {
  if (window[ExposedFn.OnAck]) {
    window[ExposedFn.OnAck](data);
  }
});
*/
//# sourceMappingURL=middleware.js.map