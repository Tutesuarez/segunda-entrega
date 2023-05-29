const socket = io()
let user
let chatBox = document.querySelector("#chat_box")
let messageLogs = document.querySelector("#message_logs")


Swal.fire({
  title: "Welcome to the Chat!",
  text: "Please fill whit your name:",
  input: "text",
  inputValidator: (value) => {
    return !value && "You need to write a username to continue!"
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((result) => {
  user = result.value
  socket.emit("newuser", { user });
  document.querySelector(".username").textContent += ` ${user}`
  chatBox.focus()
})

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value, socketid: socket.id });
      chatBox.value = ""
    }
  }
})

socket.on("messageLogs", (messages) => {
  messageLogs.innerHTML = ""
  const fragment = document.createDocumentFragment();
  messages.forEach((message) => {
    let div = document.createElement("span")
    let pUser = document.createElement("p")
    let pMessage = document.createElement("p")
    pUser.innerHTML = `<strong>${message.socketid === socket.id ? "Tú" : message.user}</strong>`
    pMessage.textContent = message.message
    message.socketid === socket.id
      ? div.classList.add("own_msg")
      : div.classList.add("other_msg")
    div.append(pUser, pMessage)
    fragment.appendChild(div)
  })
  messageLogs.appendChild(fragment)
  messageLogs.scrollTop = messageLogs.scrollHeight
})

socket.on("newuserconnected", (data) => {
  if (user) {
    Swal.fire({
      text: `${data.user} A new user has conected`,
      toast: true,
      position: "top-right",
    });
  }
});

