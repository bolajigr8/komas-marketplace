import React from 'react';

export const RefundPage: React.FC = () => {
    return (
        <div className="px-[10vw] py-[60px]">
          <h1 className="text-base font-bold pb-5">Komas500 Refund and Return Policy</h1>
          <h1 className="text-base font-bold">Refund and Return Policy</h1>
          <p className="font-medium">
            At Komas500, we are committed to ensuring a positive shopping experience
            for both buyers and sellers. This Refund and Return Policy explains the
            terms and conditions for returning products purchased on our Platform.
            Please read it carefully, as certain restrictions may apply based on
            product categories
          </p>
          <div className="bg-red-600 grid grid-cols-4">
            {/* {refundPolicyData.map((section: ReturnPolicySection, index: number) => {
              const contentWithLineBreaks = section.content
                .split('\n')
                .map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ));
    
              return (
                <section key={index} className="mb-6">
                  <ul className="list-none p-0 m-0">
                    <li className="font-medium text-lg mb-2">{section.title}</li>
                  </ul>
                  <p>{contentWithLineBreaks}</p>
                </section>
              );
            })}
    
          
    {refundPolicyGuidelinesData.map((section: PolicyGuidelineSection, index: number) => {
              const contentWithLineBreaks = section.content
                .split('\n')
                .map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ));
    
              return (
                <section key={index} className="mb-6">
                    <h1>Return to me</h1>
                  <ul className="list-none p-0 m-0">
                    <li className="font-medium text-lg mb-2">{section.title}</li>
                  </ul>
                  <p>{contentWithLineBreaks}</p>
                </section>
              );
            })} */}
          </div>
          <div className="pt-[60px]">
            <article className=" grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="py-2 px-4 text-sm flex flex-col gap-2 h-fit">
                <h1 className="text-base font-bold">1. General Return Policy</h1>
                <p className="font-medium">
                  Customers can request a return for most products within “14 days”
                  of receiving their order, provided the products are in their
                  original condition and packaging. Please note that each seller on
                  Komas500 may have specific terms, so we recommend reviewing the
                  individual seller’s policies before making a purchase
                  <span className="block pt-3">
                    To initiate a return, please contact our support team or use the
                    return request feature on our Platform.
                  </span>
                </p>
              </div>
              <div className="py-2 h-fit px-4 text-sm flex flex-col gap-2">
                <h1 className="text-base font-bold">
                  2. Eligible Return Conditions
                </h1>
                <label className="font-semibold">
                  For a product to qualify for a return and refund, the following
                  conditions must be met:
                </label>
                <ul className="font-medium">
                  <li>
                    - The item must be returned within “14 days” from the date of
                    delivery
                  </li>
                  <li>
                    - It must be unused, undamaged, and in its original packaging,
                    including all accessories, manuals, and documentation.
                  </li>
                  <li>
                    - The return request must include proof of purchase (order
                    number or receipt).
                  </li>
                </ul>
                <span className="block font-medium pt-3">
                  Returns that do not meet these conditions may be subject to
                  partial refunds or denied.
                </span>
              </div>
            </article>
    
            <h1 className="text-lg font-bold py-7">
              Category-Specific Return Guidelines
            </h1>
            <article className=" grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="px-4 py-2 h-fit text-sm flex flex-col gap-2">
                <h1 className="text-base font-bold">
                  1. Fashion (Clothing, Footwear, and Accessories)
                </h1>
                <ul className="font-medium">
                  <li>
                    - Returnable Within 14 Days: Items such as clothing, footwear,
                    and accessories can be returned if they are unworn, unwashed,
                    and have all original tags attached.
                  </li>
                  <li>
                    - Exceptions: Personalized or custom-made items are
                    non-returnable unless they are faulty or incorrect
                  </li>
                  <li>
                    - Inspection: Fashion items will undergo inspection upon return.
                    If they show signs of wear, alteration, or damage, they may not
                    qualify for a refund.
                  </li>
                </ul>
              </div>
    
              <div className="px-4 py-2 h-fit text-sm flex flex-col gap-2">
                <h1 className="text-base font-bold">2. Electronics and Gadgets</h1>
                <ul className="font-medium">
                  <li>
                    - Returnable Within 14 Days: Electronics, such as mobile phones,
                    accessories, and small appliances, are eligible for return
                    within 14 days if they are in their original condition and
                    packaging
                  </li>
                  <li>
                    - Warranty: If an electronic item arrives with a manufacturing
                    defect, please check the manufacturer's warranty or contact us
                    for assistance. Some electronics may be eligible for replacement
                    or repair rather than a refund.
                  </li>
                  <li>
                    - Non-Returnable Conditions: Items that have been modified,
                    tampered with, or show signs of use are non-returnable.
                  </li>
                </ul>
              </div>
    
              <div className="px-4 py-2 h-fit text-sm flex flex-col gap-2">
                <h1 className="text-base font-bold">
                  3. Cosmetics and Beauty Products
                </h1>
                <label className="font-semibold">
                  Due to health and safety concerns, cosmetics and beauty products
                  have stricter return guidelines:
                </label>
                <ul className="font-medium">
                  <li>
                    - Non-Returnable: Cosmetics and beauty products, including
                    makeup, skincare, and personal care items, cannot be returned
                    once opened or used. These items are only eligible for a return
                    if they arrive damaged, defective, or incorrect
                  </li>
                  <li>
                    - Eligible for Return if Unopened: If a beauty product is sealed
                    and unopened, it may be eligible for a return within 14 days.
                    Please ensure the packaging is intact and the product has not
                    been tampered with.
                  </li>
                  <li>
                    - Inspection Required: All returns for beauty products will be
                    inspected to verify their condition before any refund is issued.
                  </li>
                </ul>
              </div>
            </article>
    
            <h1 className="text-lg font-bold pt-7">Return Process</h1>
            <label className="font-semibold pb-4">
              To initiate a return, follow these steps:
            </label>
            <article className=" grid grid-cols-2 lg:grid-cols-5 gap-5">
              <p className="px-4 py-2 h-fit text-sm flex flex-col gap-2 font-medium">
                1. Contact Komas500 Support: Reach out to our customer service team
                with your order details and reason for return.
              </p>
              <p className="px-4 py-2 h-fit text-sm flex flex-col gap-2 font-medium">
                2. Prepare the Item for Return: Pack the product securely in its
                original packaging, with all accessories, documentation, and tags
                included.
              </p>
              <p className="px-4 py-2 h-fit text-sm flex flex-col gap-2 font-medium">
                3. Ship the Item: We will provide a return address or guide you to
                the nearest Komas500 pick-up station, depending on your location.
              </p>
              <p className="px-4 py-2 h-fit text-sm flex flex-col gap-2 font-medium">
                4. Inspection and Refund: Once received, the item will be inspected,
                and your refund will be processed within 5-10 business days if it
                meets all return requirements
              </p>
              <p className="px-4 py-2 h-fit text-sm flex flex-col gap-2 font-medium">
                5. Refund Methods Refunds will be issued to the original payment
                method used during checkout or as store credit to your user virtual
                wallet, based on customer preference and payment method availability
              </p>
            </article>
    
            <article>
              <div>
                <h1 className="text-lg font-bold pt-7">Refund Methods</h1>
                <p className="font-medium">
                  Refunds will be issued to the original payment method used during
                  checkout or as store credit to your user virtual wallet, based on
                  customer preference and payment method availability.
                </p>
              </div>
              <div>
                <h1 className="text-lg font-bold pt-7">Refund Timeframe</h1>
                <ul className="font-medium">
                  <li>
                    - Original Payment Method: Refunds to bank accounts or cards may
                    take 5-10 business days, depending on your bank's policies.
                  </li>
                  <li>
                    - Store Credit: Store credit will be available immediately upon
                    return approval.
                  </li>
                </ul>
              </div>
            </article>
    
            <article></article>
    
            <article>
              <h1 className="text-lg font-bold pt-7">Damaged or Defective Items</h1>
              <p className="font-medium">
                If your item arrives damaged or defective, please notify Komas500
                within “48 hours” of receiving your order. We may request photo
                evidence to facilitate the return and replacement process. Damaged
                or defective items qualify for a full refund or replacement.
              </p>
            </article>
    
            <article>
              <h1 className="text-lg font-bold pt-7">Exchange Policy</h1>
              <p className="font-medium">
                Currently, we do not offer direct exchanges. To exchange an item,
                please request a return and place a new order for the desired
                product.
              </p>
            </article>
            <article>
              <h1 className="text-lg font-bold pt-7"> Contact Information</h1>
              <p className="font-medium">
                For questions regarding returns or refunds, contact us at:
              </p>
              <ul className="font-medium">
                <li>Komas500 Support Team</li>
                <li>Email: [support@komas500.com]</li>
                <li>Phone: [will be made available soon]</li>
              </ul>
            </article>
          </div>
        </div>
      );
    };