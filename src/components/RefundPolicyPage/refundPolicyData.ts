// refundPolicyData.ts

export interface ReturnPolicySection {
  title: string;
  content: string;
}

export interface PolicyGuidelineSection {
  title: string;
  content: string;
}

export interface ReturnProcessSection {
  content: string;
}

export const refundPolicyData: ReturnPolicySection[] = [
  {
    title: 'General Return Policy',
    content:
      'Customers can request a return for most products within “14 days” of receiving their order, provided the products are in their original condition and packaging. Please note that each seller on Komas500 may have specific terms, so we recommend reviewing the individual seller’s policies before making a purchase. To initiate a return, please contact our support team or use the return request feature on our Platform.',
  },
  {
    title: 'Eligible Return Conditions',
    content: `For a product to qualify for a return and refund, the following conditions must be met:\n
      - The item must be returned within “14 days” from the date of delivery.\n
      - It must be unused, undamaged, and in its original packaging, including all accessories,  manuals, and documentation.\n
      - The return request must include proof of purchase (order number or receipt).\n
      Returns that do not meet these conditions may be subject to partial refunds or denied.
      `,
  },
];

export const refundPolicyGuidelinesData: PolicyGuidelineSection[] = [
  {
    title: '1 Fashion (Clothing, Footwear, and Accessories)',
    content: `
     - Returnable Within 14 Days: Items such as clothing, footwear, and accessories can be returned if they are unworn, unwashed, and have all original tags attached.\n
     - Exceptions: Personalized or custom-made items are non-returnable unless they are faulty or incorrect.\n
     - Inspection: Fashion items will undergo inspection upon return. If they show signs of wear, alteration, or damage, they may not qualify for a refund.`,
  },
  {
    title: 'Electronics and Gadgets',
    content: `- Returnable Within 14 Days: Electronics, such as mobile phones, accessories, and small appliances, are eligible for return within 14 days if they are in their original condition and packaging\n
    - Warranty: If an electronic item arrives with a manufacturing defect, please check the manufacturer's warranty or contact us for assistance. Some electronics may be eligible for replacement or repair rather than a refund.\n
    - Non-Returnable Conditions: Items that have been modified, tampered with, or show signs of use are non-returnable.

    `,
  },
  {
    title: 'Cosmetics and Beauty Products',
    content: `Due to health and safety concerns, cosmetics and beauty products have stricter return guidelines:\n
      - Non-Returnable: Cosmetics and beauty products, including makeup, skincare, and personal care items, cannot be returned once opened or used. These items are only eligible for a return if they arrive damaged, defective, or incorrect.\n 
      - Eligible for Return if Unopened: If a beauty product is sealed and unopened, it may be eligible for a return within 14 days. Please ensure the packaging is intact and the product has not been tampered with.\n
      - Inspection Required: All returns for beauty products will be inspected to verify their condition before any refund is issued.
`,
  },
];

export const returnProcessData: ReturnProcessSection[] = [
  {
    content: `Contact Komas500 Support: Reach out to our customer service team with your order details and reason for return.
`,
  },
  {
    content: `Prepare the Item for Return: Pack the product securely in its original packaging, with all accessories, documentation, and tags included.
`,
  },
  {
    content: `Ship the Item: We will provide a return address or guide you to the nearest Komas500 pick-up
station, depending on your location.
`,
  },
  {
    content: `Inspection and Refund: Once received, the item will be inspected, and your refund will be processed within 5-10 business days if it meets all return requirements.
`,
  },
  {
    content: `Refund Methods\n
Refunds will be issued to the original payment method used during checkout or as store credit to your user virtual wallet, based on customer preference and payment method availability
`,
  },
];



