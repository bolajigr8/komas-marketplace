import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <div className="px-[10vw] py-[60px]">
        <h1 className="text-4xl font-bold pb-5">Komas500 Terms of Service</h1>
        <p className="font-medium pb-3">
          Welcome to Komas500! By accessing or using our website, mobile app,
          and services (collectively, the "Platform"), you agree to be bound by
          these Terms of Service ("Terms"). Please read them carefully before
          proceeding. If you do not agree with these Terms, do not use our
          Platform.
        </p>

        <section className='flex flex-col gap-3'>
          <p className="font-normal">
            {' '}
            1. Agreement to Terms By accessing our Platform or using any
            services, you agree to abide by these Terms, our Privacy Policy, and
            any other policies or guidelines provided. If you represent a
            business, you confirm that you have the authority to bind that
            entity to these Terms.
          </p>

          <p className="font-normal">
            {' '}
            2. Eligibility To use Komas500, you must be at least 18 years of age
            or have obtained parental consent. By using our Platform, you
            represent and warrant that you meet these eligibility requirements.
          </p>

          <p className="font-normal">
            3. Account Registration To access certain features, such as buying
            and selling products, you may be required to register for an
            account. You agree to provide accurate and current information,
            maintain the security of your password, and accept responsibility
            for all activities under your account. Any unauthorized use must be
            reported immediately to Komas500.
          </p>

          <p className="font-normal">
            4. Marketplace Overview Komas500 is a marketplace where sellers list
            products for sale, and buyers purchase products directly from these
            sellers. Komas500 facilitates the transaction process but is not
            directly involved in the sale of products listed by sellers. As a
            marketplace, we provide a platform for sellers and buyers to
            connect, and each party is responsible for ensuring the fulfillment
            of their respective obligations.
          </p>
        </section>

        <h1 className="text-lg font-bold pt-7">
         5. Buyer and Seller Responsibilities
        </h1>
        <article>
          <h1 className="text-base font-semibold">Buyer Responsibilities</h1>

          <ul className="font-normal">
            <li>
              - Accuracy: Review product details, pricing, and other information
              before purchasing.
            </li>
            <li>
              - Payments: Complete payments using authorized methods and agree
              to follow our refund and return policy (see Section 6).
            </li>

            <li>
              - Pick-Up and Delivery: Follow all instructions provided regarding
              pick-up stations or delivery arrangements. Any fees associated
              with pick-up or delivery will be disclosed during checkout.
            </li>
          </ul>
        </article>

        <article>
          <h1 className="text-base font-semibold pt-2">Seller Responsibilities</h1>
          <ul className="font-normal">
            <li>
              {' '}
              - Listings: Ensure product listings are accurate, complete, and in
              compliance with Komas500 policies.
            </li>
            <li>
              {' '}
              - Fulfillment: Fulfill orders promptly and maintain inventory
              records to avoid cancellations.
            </li>
            <li>
              {' '}
              - Compliance: Adhere to all applicable laws and Komas500’s
              policies. Sellers are responsible for obtaining all necessary
              rights to list and sell their products on the Platform.
            </li>
          </ul>
        </article>

        <article>
          <div>
            <h1 className="text-lg font-bold pt-7">6. Orders, Payments, and Fees</h1>
            <p className="font-normal">
              Komas500 supports various payment methods, including credit/debit
              cards and online payment gateways. By providing payment
              information, you authorize us to process payments according to the
              agreed method.
            </p>
          </div>

          <div>
            <h1 className="text-base font-semibold pt-2">Orders Acceptance</h1>
            <p className="font-normal">
              We reserve the right to refuse or cancel any order for reasons
              including pricing errors, suspected fraud, or out-of-stock items.
              In cases of cancellation, any payment received will be refunded in
              accordance with our Refund Policy.
            </p>
          </div>

          <div>
            <h1 className="text-base font-semibold pt-2">Refunds and Returns</h1>
            <p className="font-normal">
              Buyers are encouraged to review the refund and return policies of
              individual sellers before making a purchase. Komas500’s refund
              policy is available at [link to Refund Policy page], and specific
              seller policies may also apply.
            </p>
          </div>

          <div>
            <h1 className="text-base font-semibold pt-2">Platform Fees</h1>
            <p className="font-normal">
              Komas500 may charge fees for certain services, including listing,
              transaction, and service fees. Any applicable fees will be
              disclosed in advance. Komas500 reserves the right to update fees
              at any time, which will be effective upon posting.
            </p>
          </div>
        </article>

        <h1 className="text-lg font-bold pt-7">7. Delivery and Pick-Up</h1>
        <article>
          <div>
            <h1 className="text-base font-semibold pt-2">Pick-Up Station</h1>
            <p className="font-normal">
              Komas500 operates pick-up stations across various locations for
              customer convenience. Buyers opting for pick-up should collect
              their orders within the specified time. Orders not picked up
              within the timeframe may be canceled, and any associated fees are
              non-refundable.
            </p>
          </div>

          <div>
            <h1 className="text-base font-semibold pt-2">Delivery Services</h1>
            <p className="font-normal">
              Komas500 works with independent drivers for delivery services.
              Delivery timelines may vary based on location and availability.
              While we strive to ensure timely delivery, delays may occur, and
              Komas500 is not liable for any direct or indirect damages due to
              delivery delays.
            </p>
          </div>

          <div>
            <h1 className="text-lg font-bold pt-7">8. User-Generated Content</h1>
            <p className="font-normal">
              Komas500 allows users to submit reviews, ratings, and other
              content ("User Content") related to products and services. By
              posting User Content, you grant Komas500 a non-exclusive,
              worldwide, royalty-free license to use, reproduce, and distribute
              your content for any lawful purpose related to the Platform.
            </p>
          </div>
          <div>
            <h1 className="text-lg font-bold pt-7">9. Intellectual Property</h1>
            <p className="font-medium">
              All content on the Komas500 Platform, including trademarks, logos,
              and text, is owned by or licensed to Komas500. You may not use our
              intellectual property without our prior written permission.
            </p>
          </div>

          <div>
            <h1 className="text-lg font-bold pt-7">10. Limitation of Liability</h1>
            <p className="font-medium">
              To the fullest extent permitted by law, Komas500 shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of or related to your use of the
              Platform, including but not limited to errors in product listings,
              delays in delivery, or any transaction conducted through the
              Platform.
            </p>
          </div>

          <div>
            <h1 className="text-lg font-bold pt-7">11. Indemnity</h1>
            <p className="font-medium">
              You agree to indemnify and hold Komas500, its directors,
              employees, and agents harmless from any claim or demand arising
              out of your use of the Platform, your violation of these Terms, or
              your infringement of any rights of a third party.
            </p>
          </div>

          <div>
            <h1 className="text-lg font-bold pt-7">12.  Termination</h1>
            <p className="font-medium">
              Komas500 reserves the right to suspend or terminate your account
              and access to the Platform at any time, for any reason, without
              notice. Upon termination, any rights granted to you under these
              Terms will cease immediately, and you must stop using the
              Platform.
            </p>
          </div>
          <div>
            <h1 className="text-lg font-bold pt-7">13. Governing Law</h1>
            <p className="font-medium">
              These Terms shall be governed by and construed in accordance with
              the laws of Nigeria. Any disputes arising out of or relating to
              these Terms or the Platform shall be subject to the exclusive
              jurisdiction of the courts in Nigeria.
            </p>
          </div>

          <div>
            <h1 className="text-lg font-bold pt-7">14.  Modifications to Terms</h1>
            <p className="font-medium">
              We reserve the right to modify these Terms at any time. Changes
              will be posted on this page, and your continued use of the
              Platform after changes are posted constitutes acceptance of the
              updated Terms.
            </p>
          </div>
        </article>

        <article>
          <h1 className="text-lg font-bold pt-7">15. Contact Information</h1>
          <p className="font-normal">
            For questions or concerns about these Terms, please contact us at:
          </p>
          <ul className="font-normal">
            <li>Komas500 Support Team</li>
            <li>Email: [support@komas500.com]</li>
            <li>Phone: [will be made available soon]</li>
          </ul>
        </article>
      </div>
    </>
  );
};
