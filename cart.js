// =====================================================
// CART
// =====================================================

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

let selectedOrderType = "";


// =====================================================
// USD TO L.L RATE
// =====================================================

const USD_TO_LL = 90000;


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(name, price, currency = "L.L") {

    const existingItem =
        cart.find(function (item) {

            return item.name === name;

        });


    if (existingItem) {

        existingItem.quantity =
            (existingItem.quantity || 1) + 1;

    }

    else {

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

            count +=
                item.quantity || 1;

        });


        cartCount.textContent =
            count;

    }

}



// =====================================================
// NOTIFICATION
// =====================================================

function showNotification(message) {

    const oldNotification =
        document.querySelector(
            ".cart-notification"
        );


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

        notification.classList.add(
            "show"
        );

    }, 10);


    setTimeout(function () {

        notification.classList.remove(
            "show"
        );


        setTimeout(function () {

            notification.remove();

        }, 300);


    }, 2000);

}



// =====================================================
// FORMAT PRICE
// =====================================================

function formatPrice(price, currency) {

    if (currency === "$") {

        return "$" +
            Number(price).toLocaleString();

    }

    return Number(price).toLocaleString() +
        " L.L";

}



// =====================================================
// CONVERT PRICE TO L.L
// =====================================================

function convertToLL(price, currency) {

    if (currency === "$") {

        return Number(price) * USD_TO_LL;

    }

    return Number(price);

}



// =====================================================
// DISPLAY CART
// =====================================================

function displayCart() {

    const cartItems =
        document.getElementById(
            "cart-items"
        );


    const totalElement =
        document.getElementById(
            "cart-total"
        );


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


        totalElement.textContent =
            "0 L.L";


        return;

    }



    // =========================
    // TOTAL IN L.L
    // =========================

    let totalLL = 0;



    // =========================
    // DISPLAY PRODUCTS
    // =========================

    cart.forEach(function (item, index) {

        const quantity =
            item.quantity || 1;


        const currency =
            item.currency || "L.L";


        const itemTotal =
            Number(item.price) * quantity;



        // Convert everything to L.L

        totalLL +=
            convertToLL(
                itemTotal,
                currency
            );



        const itemDiv =
            document.createElement("div");


        itemDiv.className =
            "cart-item";


        itemDiv.innerHTML = `

            <span>

                ${quantity} × ${item.name}

            </span>


            <span>

                ${formatPrice(
                    itemTotal,
                    currency
                )}

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



    // =========================
    // DISPLAY TOTAL
    // =========================

    totalElement.textContent =
        totalLL.toLocaleString() +
        " L.L";

}



// =====================================================
// REMOVE ONE ITEM
// =====================================================

function removeFromCart(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    }

    else {

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

        alert(
            "Your cart is empty!"
        );

        return;

    }


    const form =
        document.getElementById(
            "customer-form"
        );


    if (form) {

        form.style.display =
            "block";


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
        document.getElementById(
            "delivery-btn"
        );


    const takeawayBtn =
        document.getElementById(
            "Takeaway-btn"
        );


    const addressInput =
        document.getElementById(
            "customer-address"
        );



    // =========================
    // DELIVERY
    // =========================

    if (type === "Delivery") {

        addressInput.style.display =
            "block";


        addressInput.required =
            true;


        deliveryBtn.classList.add(
            "selected"
        );


        takeawayBtn.classList.remove(
            "selected"
        );

    }



    // =========================
    // TAKEAWAY
    // =========================

    else if (type === "Takeaway") {

        addressInput.style.display =
            "none";


        addressInput.required =
            false;


        addressInput.value =
            "";


        takeawayBtn.classList.add(
            "selected"
        );


        deliveryBtn.classList.remove(
            "selected"
        );

    }

}



// =====================================================
// SEND ORDER TO WHATSAPP
// =====================================================

function placeOrder() {

    const nameInput =
        document.getElementById(
            "customer-name"
        );


    const addressInput =
        document.getElementById(
            "customer-address"
        );


    const notesInput =
        document.getElementById(
            "customer-notes"
        );



    // =========================
    // CHECK FORM
    // =========================

    if (
        !nameInput ||
        !addressInput ||
        !notesInput
    ) {

        alert(
            "Customer form is missing."
        );

        return;

    }



    // =========================
    // CHECK ORDER TYPE
    // =========================

    if (selectedOrderType === "") {

        alert(
            "Please select Delivery or Takeaway."
        );

        return;

    }



    // =========================
    // GET VALUES
    // =========================

    const name =
        nameInput.value.trim();


    const address =
        addressInput.value.trim();


    const notes =
        notesInput.value.trim();



    // =========================
    // CHECK CART
    // =========================

    if (cart.length === 0) {

        alert(
            "Your cart is empty!"
        );

        return;

    }



    // =========================
    // NAME REQUIRED
    // =========================

    if (name === "") {

        alert(
            "Please enter your name."
        );

        return;

    }



    // =========================
    // ADDRESS REQUIRED ONLY
    // FOR DELIVERY
    // =========================

    if (
        selectedOrderType === "Delivery" &&
        address === ""
    ) {

        alert(
            "Please enter your address."
        );

        return;

    }



    // =========================
    // TOTAL IN L.L
    // =========================

    let totalLL = 0;



    // =========================
    // WHATSAPP MESSAGE
    // =========================

    let message =
        "🥐 New Order - Alkamal Croissant\n\n";



    // =========================
    // CUSTOMER INFORMATION
    // =========================

    message +=
        "Customer Information:\n";


    message +=
        "الاسم: " +
        name +
        "\n";



    // =========================
    // ORDER TYPE
    // =========================

    message +=
        "طريقة الطلب: " +
        selectedOrderType +
        "\n";



    // =========================
    // ADDRESS ONLY FOR DELIVERY
    // =========================

    if (
        selectedOrderType === "Delivery"
    ) {

        message +=
            "العنوان: " +
            address +
            "\n";

    }



    // =========================
    // NOTES
    // =========================

    if (notes !== "") {

        message +=
            "الملاحظات: " +
            notes +
            "\n";

    }



    message +=
        "\n";



    // =========================
    // ORDER
    // NO ITEM PRICES
    // =========================

    message +=
        "Order:\n";


    cart.forEach(function (item) {

        const quantity =
            item.quantity || 1;


        const currency =
            item.currency || "L.L";


        const itemTotal =
            Number(item.price) * quantity;



        // Convert item total to L.L

        totalLL +=
            convertToLL(
                itemTotal,
                currency
            );



        // Only quantity + product name

        message +=
            quantity +
            " × " +
            item.name +
            "\n";

    });



    // =========================
    // TOTAL
    // =========================

    message +=
        "\nTotal: ";


    message +=
        totalLL.toLocaleString() +
        " L.L";



    // =========================
    // ENCODE MESSAGE
    // =========================

    const encodedMessage =
        encodeURIComponent(
            message
        );



    // =========================
    // WHATSAPP NUMBER
    // =========================

    const whatsappNumber =
        "96181899554";



    // =========================
    // WHATSAPP URL
    // =========================

    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodedMessage;



    // =========================
    // OPEN WHATSAPP
    // =========================

    window.open(
        whatsappURL,
        "_blank"
    );



    // =========================
    // CLEAR CART
    // =========================

    localStorage.removeItem(
        "cart"
    );


    cart = [];


    updateCartCount();

    displayCart();

}



// =====================================================
// PAGE LOAD
// =====================================================

updateCartCount();

displayCart();