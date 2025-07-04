// 'use server'
 
// import webpush from 'web-push'
 
// webpush.setVapidDetails(
//   '<mailto:your-email@example.com>',
//   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
//   process.env.VAPID_PRIVATE_KEY!
// )
 
// let subscription: PushSubscription | null = null
 
// export async function subscribeUser(sub: PushSubscription) {
//   subscription = sub
//   // In a production environment, you would want to store the subscription in a database
//   // For example: await db.subscriptions.create({ data: sub })
//   return { success: true }
// }
 
// export async function unsubscribeUser() {
//   subscription = null
//   // In a production environment, you would want to remove the subscription from the database
//   // For example: await db.subscriptions.delete({ where: { ... } })
//   return { success: true }
// }
 
// export async function sendNotification(message: string) {
//   if (!subscription) {
//     throw new Error('No subscription available')
//   }
 
//   try {
//     await webpush.sendNotification(
//       subscription,
//       JSON.stringify({
//         title: 'Test Notification',
//         body: message,
//         icon: '/icon.png',
//       })
//     )
//     return { success: true }
//   } catch (error) {
//     console.error('Error sending push notification:', error)
//     return { success: false, error: 'Failed to send notification' }
//   }
// }



// 'use server'
 
// import webpush from 'web-push'
// import { cookies } from 'next/headers'
// import { revalidatePath } from 'next/cache'

// // Set up web push
// webpush.setVapidDetails(
//   'mailto:your-email@example.com',
//   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
//   process.env.VAPID_PRIVATE_KEY!
// )

// // In a real app, you'd store these in a database
// let subscriptions = new Map<string, PushSubscription>();

// // Push notification management
// export async function subscribeUser(sub: PushSubscription) {
//   try {
//     const userId = cookies().get('userId')?.value || 'anonymous';
//     subscriptions.set(userId, sub);
    
//     // In production, store in database
//     // await db.subscription.upsert({
//     //   where: { userId },
//     //   update: { subscription: sub },
//     //   create: { userId, subscription: sub }
//     // });
    
//     return { success: true };
//   } catch (error) {
//     console.error('Error saving subscription:', error);
//     return { success: false, error: 'Failed to save subscription' };
//   }
// }
 
// export async function unsubscribeUser() {
//   try {
//     const userId = cookies().get('userId')?.value || 'anonymous';
//     subscriptions.delete(userId);
    
//     // In production, remove from database
//     // await db.subscription.delete({
//     //   where: { userId }
//     // });
    
//     return { success: true };
//   } catch (error) {
//     console.error('Error removing subscription:', error);
//     return { success: false, error: 'Failed to remove subscription' };
//   }
// }
 
// export async function sendNotification(message: string, targetUserId?: string) {
//   try {
//     const userId = targetUserId || cookies().get('userId')?.value || 'anonymous';
//     const subscription = subscriptions.get(userId);
    
//     if (!subscription) {
//       throw new Error('No subscription available');
//     }
 
//     await webpush.sendNotification(
//       subscription,
//       JSON.stringify({
//         title: 'E-Commerce Notification',
//         body: message,
//         icon: '/icon.png',
//         url: '/',
//       })
//     );
    
//     return { success: true };
//   } catch (error) {
//     console.error('Error sending push notification:', error);
//     return { success: false, error: 'Failed to send notification' };
//   }
// }

// // E-commerce specific actions
// export async function createOrder(cartItems: any[], address: any) {
//   try {
//     // In production, save to database
//     // const order = await db.order.create({
//     //   data: {
//     //     userId: cookies().get('userId')?.value,
//     //     items: cartItems,
//     //     shippingAddress: address,
//     //     totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
//     //     status: 'PENDING'
//     //   }
//     // });
    
//     const order = {
//       id: `order-${Date.now()}`,
//       items: cartItems,
//       status: 'PENDING'
//     };
    
//     // Send order confirmation notification
//     await sendNotification(`Your order #${order.id} has been placed successfully!`);
    
//     revalidatePath('/orders');
//     return { success: true, orderId: order.id };
//   } catch (error) {
//     console.error('Error creating order:', error);
//     return { success: false, error: 'Failed to create order' };
//   }
// }

// export async function applyPromoCode(code: string) {
//   try {
//     // Mock promo code validation
//     const validCodes = {
//       'WELCOME10': { discount: 10, type: 'percentage' },
//       'FREESHIP': { discount: 5, type: 'fixed' }
//     };
    
//     const promo = validCodes[code as keyof typeof validCodes];
    
//     if (!promo) {
//       return { success: false, error: 'Invalid promo code' };
//     }
    
//     return {
//       success: true,
//       discount: promo.discount,
//       type: promo.type
//     };
//   } catch (error) {
//     console.error('Error applying promo code:', error);
//     return { success: false, error: 'Failed to apply promo code' };
//   }
// }

'use server'
 
import webpush from 'web-push'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

// TypeScript interface for subscription
interface PushSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Set up web push
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// In a real app, you'd store these in a database
let subscriptions = new Map<string, PushSubscription>();

// Push notification management
export async function subscribeUser(sub: PushSubscription) {
  try {
    const userId = cookies().get('userId')?.value || 'anonymous';
    subscriptions.set(userId, sub);
    
    // In production, store in database
    // await db.subscription.upsert({
    //   where: { userId },
    //   update: { subscription: sub },
    //   create: { userId, subscription: sub }
    // });
    
    return { success: true };
  } catch (error) {
    console.error('Error saving subscription:', error);
    return { success: false, error: 'Failed to save subscription' };
  }
}
 
export async function unsubscribeUser() {
  try {
    const userId = cookies().get('userId')?.value || 'anonymous';
    subscriptions.delete(userId);
    
    // In production, remove from database
    // await db.subscription.delete({
    //   where: { userId }
    // });
    
    return { success: true };
  } catch (error) {
    console.error('Error removing subscription:', error);
    return { success: false, error: 'Failed to remove subscription' };
  }
}
 
export async function sendNotification(message: string, targetUserId?: string) {
  try {
    const userId = targetUserId || cookies().get('userId')?.value || 'anonymous';
    const subscription = subscriptions.get(userId);
    
    if (!subscription) {
      throw new Error('No subscription available');
    }
 
    // Use the subscription directly as it's already in the correct format
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth
        }
      },
      JSON.stringify({
        title: 'E-Commerce Notification',
        body: message,
        icon: '/icon.png',
        url: '/',
      })
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}

// E-commerce specific actions
export async function createOrder(cartItems: any[], address: any) {
  try {
    // In production, save to database
    // const order = await db.order.create({
    //   data: {
    //     userId: cookies().get('userId')?.value,
    //     items: cartItems,
    //     shippingAddress: address,
    //     totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    //     status: 'PENDING'
    //   }
    // });
    
    const order = {
      id: `order-${Date.now()}`,
      items: cartItems,
      status: 'PENDING'
    };
    
    // Send order confirmation notification
    await sendNotification(`Your order #${order.id} has been placed successfully!`);
    
    revalidatePath('/orders');
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

export async function applyPromoCode(code: string) {
  try {
    // Mock promo code validation
    const validCodes: Record<string, { discount: number, type: string }> = {
      'WELCOME10': { discount: 10, type: 'percentage' },
      'FREESHIP': { discount: 5, type: 'fixed' }
    };
    
    const promo = validCodes[code];
    
    if (!promo) {
      return { success: false, error: 'Invalid promo code' };
    }
    
    return { 
      success: true, 
      discount: promo.discount,
      type: promo.type
    };
  } catch (error) {
    console.error('Error applying promo code:', error);
    return { success: false, error: 'Failed to apply promo code' };
  }
}