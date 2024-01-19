self.addEventListener("push", function (event) {
  const { data } = event
  const payload = data.json()
  const title = payload.title || "新的通知"
  const options = {
    body: payload.body,
    icon: "./icon.jpg"
  }

  event.waitUntil(self.registration.showNotification(title, options))
})
