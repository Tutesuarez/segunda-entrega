const socket = io()
const createForm = document.querySelector(".create_form")
const productsContainer = document.querySelector(".products_list")

socket.on("products", (prod) => {
  productsContainer.innerHTML = ""
  const fragment = new DocumentFragment()
  prod.forEach((item) => {
    const div = document.createElement("div")
    const h3 = document.createElement("h3")
    const pDescription = document.createElement("p")
    const pStock = document.createElement("p")
    const pPrice = document.createElement("p")
    const btn = document.createElement("button")
    const image = document.createElement("img")
    div.classList.add("product")
    h3.textContent = `Title: ${item.title}`
    pDescription.textContent = `Description: ${item.description}`
    pStock.textContent = `Stock: ${item.stock}`
    pPrice.textContent = `Price: ${item.price}`
    btn.textContent = "Delete"
    btn.classList.add("delete_btn")
    btn.id = item._id
    image.src = `./public/images/products/${item.thumbnails[0]}`
    image.alt = item.title
    div.append(image, h3, pDescription, pStock, pPrice, btn)
    fragment.appendChild(div)
  })
  productsContainer.appendChild(fragment)
})

createForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const product = new FormData(e.target)
  let res = await fetch("/api/products", {
    method: "POST",
    body: product,
  })
  let message = await res.json()
  if (message?.success) {
    Swal.fire({
      text: `${message.success}`,
      toast: true,
      position: "top-right",
    })
    createForm.reset()
  } else {
    Swal.fire({
      text: `${message.error}`,
      toast: true,
      position: "top-right",
    })
  }
})

productsContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete_btn")) {
    let res = await fetch(`/api/products/${e.target.id}`, { method: "delete" })
    let message = await res.json();
    if (message?.success) {
      Swal.fire({
        text: `${message.success}`,
        toast: true,
        position: "top-right",
      })
      createForm.reset();
    } else {
      Swal.fire({
        text: `${message.error}`,
        toast: true,
        position: "top-right",
      })
    }
  }

})



