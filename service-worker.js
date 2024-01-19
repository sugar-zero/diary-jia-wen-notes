self.addEventListener("push", function (event) {
  var options = {
    body: event.data.text(),
    icon: "images/icon.png"
  }

  event.waitUntil(self.registration.showNotification("标题", options))
})