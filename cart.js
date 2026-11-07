
// =====================================================
// CART
// =====================================================

// =====================================================
// CLEAR CART ONLY WHEN PAGE IS REFRESHED
// =====================================================

const navigationEntry =
    performance.getEntriesByType("navigation")[0];

const isPageRefresh =
    navigationEntry &&
    navigationEntry.type === "reload";

const isOldBrowserRefresh =
    performance.navigation &&
    performance.navigation.type === 1;

if (isPageRefresh || isOldBrowserRefresh) {
    localStorage.removeItem("cart");
}


// =====================================================
// LOAD CART
// =====================================================

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

let selectedOrderType = "";


// =====================================================
// USD TO L.L RATE
// =====================================================

const USD_TO_LL = 90000;


// =====================================================
// CLEAN PRICE
// =====================================================

function cleanPrice(price) {

    if (typeof price === "number") {
        return price;
    }

    return Number(
        String(price).replace(/[^0-9.-]/g, "")
    ) || 0;
}


// =====================================================
// CHECK CURRENCY
// =====================================================

function isUSD(currency) {

    return (
        currency === "$" ||
        currency === "USD" ||
        currency === "usd"
    );
}


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(name, price, currency = "L.L") {

    price = cleanPrice(price);

    const existingItem =
        cart.find(function (item) {
            return item.name === name;
        });

    if (existingItem) {

        existingItem.quantity =
            (existingItem.quantity || 1) + 1;

    } else {

        cart.push({
            name: name,
            price: price,
            currency: currency,
            quantity: 1
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();
    displayCart();

    showNotification(
        name + " added to cart ✓"
    );
}


// =====================================================
// UPDATE CART COUNT
// =====================================================

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (cartCount) {

        let count = 0;

        cart.forEach(function (item) {
            count += item.quantity || 1;
        });

        cartCount.textContent = count;
    }
}


// =====================================================
// NOTIFICATION
// =====================================================

function showNotification(message) {

    const oldNotification =
        document.querySelector(".cart-notification");

    if (oldNotification) {
        oldNotification.remove();
    }

    const notification =
        document.createElement("div");

    notification.className =
        "cart-notification";

    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(function () {
        notification.classList.add("show");
    }, 10);

    setTimeout(function () {

        notification.classList.remove("show");

        setTimeout(function () {
            notification.remove();
        }, 300);

    }, 2000);
}


// =====================================================
// FORMAT PRICE
// =====================================================

function formatPrice(price, currency) {

    price = cleanPrice(price);

    if (isUSD(currency)) {
        return "$" + price.toLocaleString();
    }

    return price.toLocaleString() + " L.L";
}


// =====================================================
// CONVERT PRICE TO L.L
// =====================================================

function convertToLL(price, currency) {

    price = cleanPrice(price);

    if (isUSD(currency)) {
        return price * USD_TO_LL;
    }

    return price;
}


// =====================================================
// DISPLAY CART
// =====================================================

function displayCart() {

    const cartItems =
        document.getElementById("cart-items");

    const totalElement =
        document.getElementById("cart-total");

    const totalUSDElement =
        document.getElementById("cart-total-usd");

    if (!cartItems || !totalElement) {
        return;
    }

    cartItems.innerHTML = "";


    // =========================
    // EMPTY CART
    // =========================

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty 🛒
            </p>
        `;

        totalElement.textContent = "0 L.L";

        if (totalUSDElement) {
            totalUSDElement.textContent = "($0.00)";
        }

        return;
    }


    // =========================
    // TOTAL
    // =========================

    let totalLL = 0;


    // =========================
    // DISPLAY PRODUCTS
    // =========================

    cart.forEach(function (item, index) {

        const quantity = item.quantity || 1;
        const currency = item.currency || "L.L";

        const itemTotal =
            cleanPrice(item.price) * quantity;

        const itemTotalLL =
            convertToLL(itemTotal, currency);

        const itemTotalUSD =
            itemTotalLL / USD_TO_LL;

        totalLL += itemTotalLL;

        const itemDiv =
            document.createElement("div");

        itemDiv.className = "cart-item";

        itemDiv.innerHTML = `
            <div class="cart-item-info">

                <span class="cart-item-name">
                    ${item.name}
                </span>

                <span class="cart-item-price">
                    ${itemTotalLL.toLocaleString()} L.L
                    ($${itemTotalUSD.toFixed(2)})
                </span>

            </div>

            <div class="quantity-controls">

                <button
                    class="quantity-btn minus-btn"
                    onclick="decreaseQuantity(${index})">
                    −
                </button>

                <span class="quantity-number">
                    ${quantity}
                </span>

                <button
                    class="quantity-btn plus-btn"
                    onclick="increaseQuantity(${index})">
                    +
                </button>

            </div>
        `;

        cartItems.appendChild(itemDiv);
    });


    // =========================
    // DISPLAY TOTAL (L.L & USD)
    // =========================

    const totalUSD =
        totalLL / USD_TO_LL;

    totalElement.textContent =
        totalLL.toLocaleString() + " L.L";

    if (totalUSDElement) {

        totalUSDElement.textContent =
            "($" + totalUSD.toFixed(2) + ")";
    }
}


// =====================================================
// INCREASE QUANTITY
// =====================================================

function increaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity =
        (cart[index].quantity || 1) + 1;

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();
    displayCart();
}


// =====================================================
// DECREASE QUANTITY
// =====================================================

function decreaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    const quantity =
        cart[index].quantity || 1;

    if (quantity > 1) {

        cart[index].quantity = quantity - 1;

    } else {

        cart.splice(index, 1);
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();
    displayCart();
}


// =====================================================
// SHOW CUSTOMER FORM
// =====================================================

function showCustomerForm() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const form =
        document.getElementById("customer-form");

    if (form) {

        form.style.display = "block";

        form.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// =====================================================
// SELECT ORDER TYPE
// =====================================================

function selectOrderType(type) {

    selectedOrderType = type;

    const deliveryBtn =
        document.getElementById("delivery-btn");

    const takeawayBtn =
        document.getElementById("Takeaway-btn");

    const addressInput =
        document.getElementById("customer-address");

    if (type === "Delivery") {

        addressInput.style.display = "block";
        addressInput.required = true;

        deliveryBtn.classList.add("selected");
        takeawayBtn.classList.remove("selected");

    } else if (type === "Takeaway") {

        addressInput.style.display = "none";
        addressInput.required = false;
        addressInput.value = "";

        takeawayBtn.classList.add("selected");
        deliveryBtn.classList.remove("selected");
    }
}


// =====================================================
// SEND ORDER TO WHATSAPP
// =====================================================

function placeOrder() {

    const nameInput =
        document.getElementById("customer-name");

    const addressInput =
        document.getElementById("customer-address");

    const notesInput =
        document.getElementById("customer-notes");

    if (!nameInput || !addressInput || !notesInput) {
        alert("Customer form is missing.");
        return;
    }

    if (selectedOrderType === "") {
        alert("Please select Delivery or Takeaway.");
        return;
    }

    const name = nameInput.value.trim();
    const address = addressInput.value.trim();
    const notes = notesInput.value.trim();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    if (selectedOrderType === "Delivery" && address === "") {
        alert("Please enter your address.");
        return;
    }

    let totalLL = 0;

    let message =
        "🥐 New Order - Alkamal Croissant\n\n";

    message += "Customer Information:\n";
    message += "الاسم: " + name + "\n";
    message += "طريقة الطلب: " + selectedOrderType + "\n";

    if (selectedOrderType === "Delivery") {
        message += "العنوان: " + address + "\n";
    }

    if (notes !== "") {
        message += "الملاحظات: " + notes + "\n";
    }

    message += "\nOrder:\n";

    cart.forEach(function (item) {

        const quantity = item.quantity || 1;
        const currency = item.currency || "L.L";

        const itemTotal =
            cleanPrice(item.price) * quantity;

        const itemTotalLL =
            convertToLL(itemTotal, currency);

        const itemTotalUSD =
            itemTotalLL / USD_TO_LL;

        totalLL += itemTotalLL;

        message +=
            quantity + " × " + item.name +
            " - " + itemTotalLL.toLocaleString() +
            " L.L ($" + itemTotalUSD.toFixed(2) + ")\n";
    });

    const totalUSD =
        totalLL / USD_TO_LL;

    message +=
        "\nTotal: " +
        totalLL.toLocaleString() +
        " L.L ($" +
        totalUSD.toFixed(2) +
        ")";

    const encodedMessage =
        encodeURIComponent(message);

    const whatsappNumber = "96181899554";

    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodedMessage;

    window.open(whatsappURL, "_blank");

    localStorage.removeItem("cart");

    cart = [];

    updateCartCount();
    displayCart();
}


// =====================================================
// PAGE LOAD
// =====================================================

updateCartCount();
displayCart();
