// app/privacy-policy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - ServeYouSmart",
  description:
    "Learn how ServeYouSmart collects, uses, and protects your personal information when you use our website and services.",
};

// A helper component for styling sections to keep the main component clean
const PolicySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-10">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
      {title}
    </h2>
    <div className="prose prose-lg max-w-none text-gray-700">{children}</div>
  </div>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white font-poppins">
      <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="text-left mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <PolicySection title="Introduction">
          <p>
            Welcome to ServeYouSmart ("we," "us," or "our"). We are committed to
            protecting your personal information and your right to privacy. This
            Privacy Policy explains what information we collect, how we use it,
            and what rights you have in relation to it.
          </p>
          <p>
            This policy applies to all information collected through our website
            (such as <Link href="/">serveyousmart.com</Link>), and/or any
            related services, sales, marketing, or events (we refer to them
            collectively in this privacy policy as the "Services").
          </p>
        </PolicySection>

        <PolicySection title="1. What Information Do We Collect?">
          <h3 className="text-xl font-semibold mt-6 mb-2">
            Personal Information You Disclose to Us
          </h3>
          <p>
            We collect personal information that you voluntarily provide to us
            when you register on the Services, place an order, or contact us.
            The personal information we collect includes the following:
          </p>
          <ul>
            <li>
              <strong>Contact Information:</strong> Your first and last name,
              email address, phone number, and mailing address.
            </li>
            <li>
              <strong>Account Information:</strong> Your username, password, and
              order history.
            </li>
            <li>
              <strong>Payment Information:</strong> As we operate on a "Cash on
              Delivery" (COD) model, we do not collect or store credit/debit
              card numbers online. If you request a refund via bank transfer, we
              will collect necessary bank account details to process the refund.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            Information Automatically Collected
          </h3>
          <p>
            We automatically collect certain information when you visit, use, or
            navigate the Services. This information does not reveal your
            specific identity but may include device and usage information.
          </p>
          <ul>
            <li>
              <strong>Device Information:</strong> Information about your
              computer, phone, or tablet, such as your IP address, browser type,
              operating system, and device identifiers.
            </li>
            <li>
              <strong>Usage Information:</strong> Information about how you use
              our Services, such as the pages you viewed, the links you clicked,
              and the time you spent on our site. This is collected using
              cookies and similar tracking technologies.
            </li>
          </ul>
        </PolicySection>

        <PolicySection title="2. How Do We Use Your Information?">
          <p>
            We use the information we collect for various business purposes,
            including:
          </p>
          <ul>
            <li>
              <strong>To Fulfill and Manage Your Orders:</strong> To process
              your orders, deliver your products, handle payments (COD), and
              manage returns.
            </li>
            <li>
              <strong>To Manage Your Account:</strong> To create and manage your
              account, and to allow you to access your order history.
            </li>
            <li>
              <strong>To Communicate with You:</strong> To send you
              transactional information, such as order confirmations, shipping
              updates, and customer service responses.
            </li>
            <li>
              <strong>To Improve Our Services:</strong> To analyze usage trends,
              understand what products are popular, and improve the user
              experience on our website.
            </li>
            <li>
              <strong>For Security Purposes:</strong> To help maintain the
              safety and security of our Services, including fraud monitoring
              and prevention.
            </li>
          </ul>
        </PolicySection>

        <PolicySection title="3. Will Your Information Be Shared With Anyone?">
          <p>
            We only share your information with third parties in the following
            situations:
          </p>
          <ul>
            <li>
              <strong>Shipping & Logistics Partners:</strong> We share your
              name, shipping address, and phone number with our courier partners
              to deliver your orders.
            </li>
            <li>
              <strong>Legal Obligations:</strong> We may disclose your
              information where we are legally required to do so in order to
              comply with applicable law, governmental requests, or legal
              process.
            </li>
            <li>
              <strong>Business Transfers:</strong> We may share or transfer your
              information in connection with, or during negotiations of, any
              merger, sale of company assets, financing, or acquisition of all
              or a portion of our business to another company.
            </li>
          </ul>
          <p>
            We do not sell, rent, or trade any of your personal information with
            third parties for their marketing purposes.
          </p>
        </PolicySection>

        <PolicySection title="4. How Long Do We Keep Your Information?">
          <p>
            We will only keep your personal information for as long as it is
            necessary for the purposes set out in this privacy policy, unless a
            longer retention period is required or permitted by law (such as for
            tax, accounting, or other legal requirements). When we have no
            ongoing legitimate business need to process your personal
            information, we will either delete or anonymize it.
          </p>
        </PolicySection>

        <PolicySection title="5. How Do We Keep Your Information Safe?">
          <p>
            We have implemented appropriate technical and organizational
            security measures designed to protect the security of any personal
            information we process. However, despite our safeguards and efforts
            to secure your information, no electronic transmission over the
            Internet or information storage technology can be guaranteed to be
            100% secure. We cannot promise or guarantee that hackers or other
            unauthorized third parties will not be able to defeat our security.
          </p>
        </PolicySection>

        <PolicySection title="6. What Are Your Privacy Rights?">
          <p>
            You have certain rights under applicable data protection laws. These
            may include the right to:
          </p>
          <ul>
            <li>
              <strong>Access:</strong> Request a copy of the personal
              information we hold about you.
            </li>
            <li>
              <strong>Correction:</strong> Request that we correct any
              inaccurate or incomplete information.
            </li>
            <li>
              <strong>Deletion:</strong> Request that we delete your personal
              information, subject to certain exceptions.
            </li>
          </ul>
          <p>
            If you have an account with us, you can review and change your
            information by logging into your account settings. For all other
            requests, please contact us using the information provided below.
          </p>
        </PolicySection>

        <PolicySection title="7. Do We Make Updates to This Policy?">
          <p>
            Yes, we will update this policy as necessary to stay compliant with
            relevant laws. The updated version will be indicated by a "Last
            Updated" date, and the updated version will be effective as soon as
            it is accessible. We encourage you to review this privacy policy
            frequently to be informed of how we are protecting your information.
          </p>
        </PolicySection>

        <PolicySection title="8. How Can You Contact Us About This Policy?">
          <p>
            If you have questions or comments about this policy, you may contact
            our Data Protection Officer (DPO) by email at{" "}
            <a
              href="mailto:privacy@serveyousmart.com"
              className="text-blue-600 font-semibold"
            >
              privacy@serveyousmart.com
            </a>
            , or by post to:
          </p>
          <address className="not-italic mt-4 border-l-4 border-gray-200 pl-4">
            <span className="font-bold text-2xl">ServeYouSmart - </span>{" "}
            <span>
              A Project of <span className="text-blue-500 font-bold text-xl">ServiSmart</span>
            </span>
            <br />
            Attn: Privacy Department
            <br />
            Bahria Town, Lahore
            <br />
            Lahore, Punjab, 53720
            <br />
            Pakistan
          </address>
        </PolicySection>
      </div>
    </div>
  );
}
