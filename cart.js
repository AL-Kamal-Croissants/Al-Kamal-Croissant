let cart = JSON.parse(localStorage.getItem("cart")) || [];


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(name, price) {

    const existingItem = cart.find(function (item) {
        return item.name === name;
    });

    if (existingItem) {

        existingItem.quantity =
            (existingItem.quantity || 1) + 1;

    } else {

        cart.push({
            name: name,
            price: price,
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

    notification.textContent =
        message;

    document.body.appendChild(
        notification
    );

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
// DISPLAY CART
// =====================================================

function displayCart() {

    const cartItems =
        document.getElementById("cart-items");

    const totalElement =
        document.getElementById("cart-total");

    if (!cartItems || !totalElement) {
        return;
    }

    cartItems.innerHTML = "";

    let total = 0;


    // Empty cart
    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty 🛒
            </p>
        `;

        totalElement.textContent =
            "0 L.L";

        return;
    }


    // Display products
    cart.forEach(function (item, index) {

        const quantity =
            item.quantity || 1;

        const itemTotal =
            item.price * quantity;

        total += itemTotal;


        const itemDiv =
            document.createElement("div");

        itemDiv.className =
            "cart-item";

        itemDiv.innerHTML = `

            <span>
                ${quantity} × ${item.name}
            </span>

            <span>
                ${itemTotal.toLocaleString()} L.L
            </span>

            <button
                onclick="removeFromCart(${index})">
                Remove
            </button>

        `;

        cartItems.appendChild(
            itemDiv
        );

    });


    // Display total
    totalElement.textContent =
        total.toLocaleString() +
        " L.L";
}


// =====================================================
// REMOVE ONE ITEM
// =====================================================

function removeFromCart(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

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
// SEND ORDER TO WHATSAPP
// =====================================================

function placeOrder() {

    const nameInput =
        document.getElementById("customer-name");

    const addressInput =
        document.getElementById("customer-address");


    // Make sure the inputs exist
    if (!nameInput || !addressInput) {

        alert("Customer form is missing.");

        return;
    }


    const name =
        nameInput.value.trim();

    const address =
        addressInput.value.trim();


    // Check cart
    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }


    // Check customer information
    if (name === "" || address === "") {

        alert(
            "Please enter your name and address."
        );

        return;
    }


    let total = 0;


    // Start WhatsApp message
    let message =
        "🥐 New Order - Alkamal Croissant\n\n";


    // Customer information
    message +=
        "Customer Information:\n";

    message +=
        "الاسم: " +
        name +
        "\n";

    message +=
        "العنوان: " +
        address +
        "\n\n";


    // Order
    message +=
        "Order:\n";


    cart.forEach(function (item) {

        const quantity =
            item.quantity || 1;

        const itemTotal =
            item.price * quantity;

        total += itemTotal;


        // Product name + quantity
        message +=
            quantity +
            " " +
            item.name +
            "\n";

    });


    // Total
    message +=
        "\nTotal: " +
        total.toLocaleString() +
        " L.L";


    // Encode message
    const encodedMessage =
        encodeURIComponent(message);


    // YOUR WHATSAPP NUMBER
    const whatsappNumber =
        "96181899554";


    // WhatsApp URL
    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodedMessage;


    // Open WhatsApp
    window.open(
        whatsappURL,
        "_blank"
    );


    // Clear cart
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
