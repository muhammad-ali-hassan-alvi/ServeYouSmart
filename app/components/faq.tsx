"use client"; // This is fine, but not strictly necessary unless you add client-side hooks (like useState for search)
import Link from "next/link";

// NOTE: 'export const metadata' has been removed.
// This should be placed in the parent page.tsx file.

// --- SVG ICONS ---

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

const ShippingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-12 h-12 mx-auto mb-4 text-blue-600"
  >
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1M14 9h4l4 4v4h-2m-4-8v8m0 0h-5.5m5.5 0v-8"
    />
  </svg>
);

const ProductIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-12 h-12 mx-auto mb-4 text-blue-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.2-1.076-2.2-2.2s1.124-2.109 2.2-2.2a4.5 4.5 0 014.884 4.484z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.75 15a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.2-1.076-2.2-2.2s1.124-2.109 2.2-2.2a4.5 4.5 0 014.884 4.484z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM3.75 12a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM12 18.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
    />
  </svg>
);

const ReturnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-12 h-12 mx-auto mb-4 text-blue-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
    />
  </svg>
);

// --- NEW ICON FOR CASH ON DELIVERY ---
const CashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-12 h-12 mx-auto mb-4 text-blue-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 01.75.75v.75m0 0h.75a.75.75 0 010 1.5h-.75m0 0a.75.75 0 01-.75.75v.75m0 0h.75a.75.75 0 010 1.5h-.75m0 0a.75.75 0 01-.75.75v.75M6 12v-1.5a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v1.5m0 0v1.5a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-1.5m6-3a.75.75 0 00-.75.75v.75h.75a.75.75 0 000-1.5h-.75z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18.75 19.5v-.75a.75.75 0 00-.75-.75h-.75a.75.75 0 00-.75.75v.75m.75 0v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75m3.75 0h.75a.75.75 0 000-1.5h-.75a.75.75 0 000 1.5z"
    />
  </svg>
);

const faqs = [
  {
    category: "Products & Compatibility",
    id: "products",
    icon: <ProductIcon />,
    questions: [
      {
        q: "How do I know if a part will fit my car?",
        a: "We highly recommend using our **Vehicle Fitment Tool** at the top of every category page. Simply enter your car's year, make, and model to see parts guaranteed to fit. You can also check the manufacturer's part number (OEM number) in the product specifications.",
      },
      {
        q: "Are your parts OEM or aftermarket?",
        a: "We offer a wide range of both! **OEM** parts are identical to the ones your vehicle was built with. **Aftermarket** parts are designed to function the same, often at a more affordable price. The part type is clearly labeled on each product page.",
      },
      {
        q: "Do your parts come with a warranty?",
        a: "Yes, most of our products are covered by a manufacturer's warranty. The specific terms can be found on the product details page or in our full <a href='/warranty-policy' class='text-blue-600 font-semibold hover:underline'>Warranty Policy</a>.",
      },
    ],
  },
  {
    category: "Ordering & Shipping",
    id: "shipping",
    icon: <ShippingIcon />,
    questions: [
      {
        q: "What are your shipping options and costs?",
        a: "We offer several shipping speeds calculated at checkout. Since all orders are Cash on Delivery, you will pay the total amount (including shipping) to the courier when your package arrives. We offer free standard shipping on orders over $75!",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you will receive an email with a tracking number. This helps you know when to expect the delivery so you can have your cash payment ready.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we only ship to addresses within the United States.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    id: "returns",
    icon: <ReturnIcon />,
    questions: [
      {
        q: "What is your return policy for COD orders?",
        a: "We offer a 30-day return policy. Since you paid in cash, refunds are processed via bank transfer or store credit after we receive the returned item. To start a return, please <a href='/contact-us' class='text-blue-600 font-semibold hover:underline'>contact our support team</a> with your order number. They will guide you through the process of shipping the item back to us.",
      },
      {
        q: "What if my order arrives damaged or is incorrect?",
        a: "**This is very important for COD.** Before paying the courier, please inspect the package for any visible damage. If the box is damaged, or if you believe the order is incorrect, you have the right to refuse the delivery. If you only notice an issue after paying, please contact us within 48 hours with photos, and we will arrange a solution.",
      },
      {
        q: "How do I exchange a part?",
        a: "To exchange an item, please contact our support team to arrange a return of the original part. Once the return is processed, you can place a new COD order for the correct item you need.",
      },
    ],
  },
  // --- UPDATED PAYMENT SECTION ---
  {
    category: "Payment",
    id: "payment",
    icon: <CashIcon />, // Using the new icon
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We exclusively accept **Cash on Delivery (COD)**. This means you pay for your order in cash directly to the delivery courier when it arrives at your address. Please try to have the exact amount ready to ensure a smooth handover.",
      },
      {
        q: "Is my payment information secure?",
        a: "Your financial security is guaranteed because we **never ask for your payment information online**. You don't need to enter any credit card or bank details on our website. You only pay when you have the product in your hands.",
      },
      {
        q: "Do I need an account to place an order?",
        a: "No, you can check out as a guest. However, creating an account allows you to track orders easily, view your history, and save your vehicle information for a faster shopping experience next time.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-gray-50 font-poppins">
      {/* Header Section */}
      <div className="py-20 sm:py-28 text-center bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Help Center
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Your questions, answered. Find what you need to get back on the
            road, faster.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <SearchIcon />
              </div>
              <input
                id="search-faq"
                name="search-faq"
                type="search"
                placeholder="Search for a question (e.g., 'shipping')"
                className="block w-full rounded-full border border-gray-300 bg-white py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:py-24">
        {/* Category Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 text-center">
          {faqs.map((cat) => (
            <a
              href={`#${cat.id}`}
              key={cat.id}
              className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {cat.icon}
              <h2 className="font-semibold text-gray-800 text-lg">
                {cat.category}
              </h2>
            </a>
          ))}
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-12">
          {faqs.map((cat) => (
            <div key={cat.category} id={cat.id} className="scroll-mt-24">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 border-b border-gray-200 pb-4 mb-8">
                {cat.category}
              </h2>
              <div className="space-y-4">
                {cat.questions.map((faq) => (
                  <details
                    key={faq.q}
                    className="group p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-gray-900">
                      {faq.q}
                      <span className="transition group-open:rotate-180">
                        <svg
                          fill="none"
                          height="24"
                          shapeRendering="geometricPrecision"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </span>
                    </summary>
                    <div
                      className="prose prose-blue mt-3 pt-3 border-t border-gray-100 text-gray-600"
                      dangerouslySetInnerHTML={{ __html: faq.a }}
                    />
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* "Still Need Help?" CTA */}
        <div className="mt-24 text-center bg-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Still have questions?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100">
            Our expert support team is here to help. Get in touch and we'll get
            you the answer you need.
          </p>
          <div className="mt-8">
            <Link
              href="/contact-us"
              className="inline-block rounded-full bg-white px-8 py-3.5 text-base font-semibold text-blue-600 shadow-md hover:bg-blue-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
