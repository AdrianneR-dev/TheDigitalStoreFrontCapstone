// Product data - all product info lives here instead of in the HTML
const products = [
    {
        name: "Activated Charcoal Sugar Scrub",
        price: "$5.00 USD",
        image: "images/activatedCharcoalScrub.webp",
        alt: "charcoal sugar scrub",
        link: "activatedcharcoalscrub.html"
    },
    {
        name: "Sea Moss Bar Soap",
        price: "$5.00 USD",
        image: "images/seamossbarsoap.webp",
        alt: "sea moss bar soap",
        link: "seamossbarsoap.html"
    },
    {
        name: "Liquid Sea Moss Soap",
        price: "$13.00 USD",
        image: "images/liquidseamossSoap.jpg",
        alt: "bottle with pump containing homemade liquid soap",
        link: "liquidseamosssoap.html"
    },
    {
        name: "Sea Moss Lotion for Eczema",
        price: "$10.00 USD",
        image: "images/oilFreeLotion.webp",
        alt: "opaque bottle of oil free lotion",
        link: "seamosslotion.html"
    },
    {
        name: "Castile Soap",
        price: "$13.00 USD",
        image: "images/liquidcastilesoap.webp",
        alt: "liquid soap in a bottle",
        link: "castilesoap.html"
    },
    {
        name: "Activated Charcoal Soap Bar",
        price: "$5.00 USD",
        image: "images/charcoalBarSoap.webp",
        alt: "a black bar of soap",
        link: "activatedcharcoalsoapbar.html"
    },
    {
        name: "Liquid Activated Charcoal Soap",
        price: "$13.00 USD",
        image: "images/liquidActivatedCharcoalSoap.webp",
        alt: "liquid soap with black color in a container",
        link: "liquidactivatedcharcoalsoap.html"
    },
    {
        name: "Sulfur Bar Soap",
        price: "$5.00 USD",
        image: "images/sulfurBarSoap.webp",
        alt: "yellow bar of soap",
        link: "sulfurbarsoap.html"
    },
    {
        name: "Liquid Sulfur Soap",
        price: "$13.00 USD",
        image: "images/liquidSulfurSoap.webp",
        alt: "yellow liquid soap",
        link: "liquidsulfursoap.html"
    }
];

// On page mount, dynamically build the product cards
document.addEventListener("DOMContentLoaded", () => {
    const catalog = document.getElementById("product-catalog");

    // Only run on pages that have the product catalog container
    // Without this guard, the script crashes on index.html and other pages,
    // breaking all other scripts that load after it (including indexcarousel.js)
    if (!catalog) return;

    products.forEach(product => {
        // Create the card container
        const card = document.createElement("div");
        card.classList.add("product");

        // Build the inner HTML for each card
        card.innerHTML = `
            <a href="${product.link}" alt="image link to ${product.name} product details page">
                <img height="300px" src="${product.image}" class="interactive-image" alt="${product.alt}" />
            </a>
            <p>${product.name}</p>
            <span>${product.price}</span>
        `;

        // Inject the card into the empty container
        catalog.appendChild(card);
    });
});
