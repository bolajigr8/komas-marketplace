// import { useState, useCallback, useEffect } from 'react'
// import { BiMinus, BiPlus } from 'react-icons/bi'
// import { Button, Input } from '@nextui-org/react'
// import { useSession } from 'next-auth/react'
// import { useToast } from '@/hooks/use-toast'
// import { useAppDispatch } from '@/redux-store/hooks'
// import { cartActions } from '@/redux-store/store-slices/CartSlice'
// import {
//   addProductToCart,
//   removeProductFromCart,
// } from '@/lib/server-actions/product'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '../ui/dialog'

// type PropsType = {
//   productId: string
//   maxQuantity?: number
//   initialQuantity: number
//   // minQuantity?: number;
//   onQuantityChange?: (quantity: number) => void
//   size?: 'sm' | 'md' | 'lg'
//   showQuickEdit?: boolean
//   className?: string
// }
// type QuantitySize = 'sm' | 'md' | 'lg'

// const sizeConfig: Record<
//   QuantitySize,
//   { wrapper: string; button: string; text: string; icon: number }
// > = {
//   sm: { wrapper: 'p-1', button: 'p-1', text: 'text-sm', icon: 14 },
//   md: { wrapper: 'p-2', button: 'p-2', text: 'text-base', icon: 18 },
//   lg: { wrapper: 'p-3', button: 'p-3', text: 'text-lg', icon: 22 },
// }

// const CartCounter = ({
//   productId,
//   initialQuantity,
//   maxQuantity = 99,
//   onQuantityChange,
//   size = 'sm',
//   showQuickEdit = true,
//   className = '',
// }: PropsType) => {
//   const [quantity, setQuantity] = useState(initialQuantity)
//   const [isLoading, setIsLoading] = useState(false)
//   const [editValue, setEditValue] = useState(initialQuantity.toString())
//   const [isDialogOpen, setIsDialogOpen] = useState(false)

//   const dispatch = useAppDispatch()
//   const { data: session } = useSession()
//   const { toast } = useToast()

//   const handleQuantityUpdate = useCallback(
//     async (newQuantity: number) => {
//       if (
//         newQuantity < 0 ||
//         newQuantity > maxQuantity ||
//         newQuantity === quantity
//       )
//         return

//       setIsLoading(true)
//       try {
//         setQuantity(newQuantity)
//         onQuantityChange?.(newQuantity)

//         const action =
//           newQuantity === 0 ? 'removeFromCart' : 'updateCartQuantity'
//         dispatch(
//           cartActions[action]({
//             productId,
//             quantity: newQuantity,
//             // isAuthenticated: !!session?.user,
//           })
//         )

//         if (session?.user) {
//           const serverAction =
//             newQuantity === 0 ? removeProductFromCart : addProductToCart
//           const response = await serverAction({
//             productId,
//             quantity: newQuantity,
//           })
//           if (response.hasError) throw new Error(response.message)
//         }

//         if (Math.abs(newQuantity - quantity) > 1) {
//           toast({ description: 'Quantity updated', duration: 2000 })
//         }
//       } catch (error) {
//         setQuantity(quantity)
//         onQuantityChange?.(quantity)
//         dispatch(
//           cartActions.updateCartQuantity({
//             productId,
//             quantity,
//             // isAuthenticated: !!session?.user,
//           })
//         )
//         toast({
//           title: 'Update failed',
//           description: 'Please try again',
//           variant: 'destructive',
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [
//       dispatch,
//       maxQuantity,
//       onQuantityChange,
//       productId,
//       quantity,
//       session?.user,
//       toast,
//     ]
//   )

//   const { wrapper, button, text, icon } = sizeConfig[size]

//   return (
//     <div
//       className={`flex items-center gap-1 bg-[#3bb77e]/10 rounded-full ${wrapper} ${className} ${
//         isLoading ? 'opacity-50' : ''
//       }`}
//     >
//       <button
//         onClick={() => handleQuantityUpdate(quantity - 1)}
//         disabled={quantity <= 0 || isLoading}
//         className={`text-[#3bb77e] disabled:opacity-40 hover:bg-[#3bb77e]/20 rounded-full ${button}`}
//         aria-label='Decrease'
//       >
//         <BiMinus size={icon} />
//       </button>

//       {showQuickEdit ? (
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <button
//               className={`min-w-[2.5em] font-semibold text-[#3bb77e] hover:bg-[#3bb77e]/20 rounded-full transition-colors`}
//               disabled={isLoading}
//             >
//               {quantity}
//             </button>
//           </DialogTrigger>
//           <DialogContent className='sm:max-w-[425px]'>
//             <DialogHeader>
//               <DialogTitle>Edit Quantity</DialogTitle>
//             </DialogHeader>
//             <div className='grid gap-4 py-4'>
//               <Input
//                 type='number'
//                 value={editValue}
//                 onChange={(e) => setEditValue(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     const val = parseInt(editValue)
//                     if (!isNaN(val)) handleQuantityUpdate(val)
//                     setIsDialogOpen(false)
//                   }
//                 }}
//                 min={0}
//                 max={maxQuantity}
//                 className='text-center focus:outline-none focus:ring-2 focus:ring-[#3bb77e] '
//                 autoFocus
//               />
//               <div className='flex justify-end gap-2'>
//                 <Button
//                   // variant="default"
//                   onClick={() => setIsDialogOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     const val = parseInt(editValue)
//                     if (!isNaN(val)) handleQuantityUpdate(val)
//                     setIsDialogOpen(false)
//                   }}
//                 >
//                   Update
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       ) : (
//         <span
//           className={`min-w-[2.5em] text-center font-semibold text-[#3bb77e] ${text}`}
//         >
//           {quantity}
//         </span>
//       )}

//       <button
//         onClick={() => handleQuantityUpdate(quantity + 1)}
//         disabled={quantity >= maxQuantity || isLoading}
//         className={`text-[#3bb77e] disabled:opacity-40 hover:bg-[#3bb77e]/20 rounded-full ${button}`}
//         aria-label='Increase'
//       >
//         <BiPlus size={icon} />
//       </button>
//     </div>
//   )
// }

// export default CartCounter

// import { useState, useCallback, useEffect } from 'react'
// import { BiMinus, BiPlus } from 'react-icons/bi'
// import { Button, Input } from '@nextui-org/react'
// import { useSession } from 'next-auth/react'
// import { useToast } from '@/hooks/use-toast'
// import { useAppDispatch } from '@/redux-store/hooks'
// import { cartActions } from '@/redux-store/store-slices/CartSlice'
// import {
//   addProductToCart,
//   removeProductFromCart,
// } from '@/lib/server-actions/product'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '../ui/dialog'

// type PropsType = {
//   productId: string
//   maxQuantity?: number
//   initialQuantity: number
//   onQuantityChange?: (quantity: number) => void
//   size?: 'sm' | 'md' | 'lg'
//   showQuickEdit?: boolean
//   className?: string
// }
// type QuantitySize = 'sm' | 'md' | 'lg'

// const sizeConfig: Record<
//   QuantitySize,
//   { wrapper: string; button: string; text: string; icon: number }
// > = {
//   sm: { wrapper: 'p-1', button: 'p-1', text: 'text-sm', icon: 14 },
//   md: { wrapper: 'p-2', button: 'p-2', text: 'text-base', icon: 18 },
//   lg: { wrapper: 'p-3', button: 'p-3', text: 'text-lg', icon: 22 },
// }

// const CartCounter = ({
//   productId,
//   initialQuantity,
//   maxQuantity = 99,
//   onQuantityChange,
//   size = 'sm',
//   showQuickEdit = true,
//   className = '',
// }: PropsType) => {
//   const [quantity, setQuantity] = useState(initialQuantity)
//   const [isLoading, setIsLoading] = useState(false)
//   const [editValue, setEditValue] = useState(initialQuantity.toString())
//   const [isDialogOpen, setIsDialogOpen] = useState(false)

//   const dispatch = useAppDispatch()
//   const { data: session } = useSession()
//   const { toast } = useToast()

//   const getToastMessage = (oldQty: number, newQty: number) => {
//     if (newQty === 0) {
//       return {
//         title: '🗑️ Removed from cart',
//         description: 'Item removed successfully',
//       }
//     }
//     if (oldQty === 0) {
//       return {
//         title: '🛒 Added to cart',
//         description: 'Item added successfully',
//       }
//     }
//     if (newQty > oldQty) {
//       return {
//         title: '➕ Quantity increased',
//         description: `Updated to ${newQty} items`,
//       }
//     }
//     return {
//       title: '➖ Quantity decreased',
//       description: `Updated to ${newQty} items`,
//     }
//   }

//   const handleQuantityUpdate = useCallback(
//     async (newQuantity: number) => {
//       if (
//         newQuantity < 0 ||
//         newQuantity > maxQuantity ||
//         newQuantity === quantity
//       )
//         return

//       const oldQuantity = quantity
//       setIsLoading(true)

//       try {
//         // Optimistically update UI
//         setQuantity(newQuantity)
//         onQuantityChange?.(newQuantity)

//         // Update Redux store
//         const action =
//           newQuantity === 0 ? 'removeFromCart' : 'updateCartQuantity'
//         dispatch(
//           cartActions[action]({
//             productId,
//             quantity: newQuantity,
//           })
//         )

//         // Sync with server if user is authenticated
//         if (session?.user) {
//           let response

//           if (newQuantity === 0) {
//             // Remove from cart
//             response = await removeProductFromCart({
//               productId,
//               quantity: oldQuantity, // Send the old quantity to remove
//             })
//           } else {
//             // Add/update cart
//             response = await addProductToCart({
//               productId,
//               quantity: newQuantity,
//             })
//           }

//           if (response.hasError) {
//             throw new Error(response.message)
//           }
//         }

//         // Show success toast
//         const toastMessage = getToastMessage(oldQuantity, newQuantity)
//         toast({
//           title: toastMessage.title,
//           description: toastMessage.description,
//           duration: 2000,
//         })
//       } catch (error: any) {
//         console.error('Cart update failed:', error)

//         // Revert optimistic updates
//         setQuantity(oldQuantity)
//         onQuantityChange?.(oldQuantity)
//         dispatch(
//           cartActions.updateCartQuantity({
//             productId,
//             quantity: oldQuantity,
//           })
//         )

//         // Show error toast with specific message
//         toast({
//           title: '❌ Update failed',
//           description:
//             error.message || 'Unable to update cart. Please try again.',
//           variant: 'destructive',
//           duration: 3000,
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [
//       dispatch,
//       maxQuantity,
//       onQuantityChange,
//       productId,
//       quantity,
//       session?.user,
//       toast,
//     ]
//   )

//   // Sync component state with prop changes
//   useEffect(() => {
//     setQuantity(initialQuantity)
//     setEditValue(initialQuantity.toString())
//   }, [initialQuantity])

//   const { wrapper, button, text, icon } = sizeConfig[size]

//   return (
//     <div
//       className={`flex items-center gap-1 bg-[#3bb77e]/10 rounded-full ${wrapper} ${className} ${
//         isLoading ? 'opacity-50 pointer-events-none' : ''
//       }`}
//     >
//       <button
//         onClick={() => handleQuantityUpdate(quantity - 1)}
//         disabled={quantity <= 0 || isLoading}
//         className={`text-[#3bb77e] disabled:opacity-40 hover:bg-[#3bb77e]/20 rounded-full transition-colors ${button}`}
//         aria-label='Decrease quantity'
//       >
//         <BiMinus size={icon} />
//       </button>

//       {showQuickEdit ? (
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <button
//               className={`min-w-[2.5em] font-semibold text-[#3bb77e] hover:bg-[#3bb77e]/20 rounded-full transition-colors px-2 py-1`}
//               disabled={isLoading}
//               aria-label='Edit quantity'
//             >
//               {quantity}
//             </button>
//           </DialogTrigger>
//           <DialogContent className='sm:max-w-[425px]'>
//             <DialogHeader>
//               <DialogTitle>Edit Quantity</DialogTitle>
//             </DialogHeader>
//             <div className='grid gap-4 py-4'>
//               <Input
//                 type='number'
//                 value={editValue}
//                 onChange={(e) => setEditValue(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     const val = parseInt(editValue)
//                     if (!isNaN(val) && val >= 0 && val <= maxQuantity) {
//                       handleQuantityUpdate(val)
//                       setIsDialogOpen(false)
//                     }
//                   }
//                   if (e.key === 'Escape') {
//                     setIsDialogOpen(false)
//                   }
//                 }}
//                 min={0}
//                 max={maxQuantity}
//                 className='text-center focus:outline-none focus:ring-2 focus:ring-[#3bb77e]'
//                 autoFocus
//               />
//               <div className='text-sm text-gray-500 text-center'>
//                 Max quantity: {maxQuantity}
//               </div>
//               <div className='flex justify-end gap-2'>
//                 <Button
//                   variant='bordered'
//                   onClick={() => {
//                     setEditValue(quantity.toString())
//                     setIsDialogOpen(false)
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     const val = parseInt(editValue)
//                     if (!isNaN(val) && val >= 0 && val <= maxQuantity) {
//                       handleQuantityUpdate(val)
//                       setIsDialogOpen(false)
//                     } else {
//                       toast({
//                         title: 'Invalid quantity',
//                         description: `Please enter a number between 0 and ${maxQuantity}`,
//                         variant: 'destructive',
//                       })
//                     }
//                   }}
//                   disabled={isLoading}
//                 >
//                   Update
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       ) : (
//         <span
//           className={`min-w-[2.5em] text-center font-semibold text-[#3bb77e] ${text}`}
//         >
//           {quantity}
//         </span>
//       )}

//       <button
//         onClick={() => handleQuantityUpdate(quantity + 1)}
//         disabled={quantity >= maxQuantity || isLoading}
//         className={`text-[#3bb77e] disabled:opacity-40 hover:bg-[#3bb77e]/20 rounded-full transition-colors ${button}`}
//         aria-label='Increase quantity'
//       >
//         <BiPlus size={icon} />
//       </button>
//     </div>
//   )
// }

// export default CartCounter

// import { useState, useCallback, useEffect } from 'react'
// import { BiMinus, BiPlus } from 'react-icons/bi'
// import { Button, Input } from '@nextui-org/react'
// import { useSession } from 'next-auth/react'
// import { useToast } from '@/hooks/use-toast'
// import { useAppDispatch } from '@/redux-store/hooks'
// import { cartActions } from '@/redux-store/store-slices/CartSlice'
// import {
//   addProductToCart,
//   removeProductFromCart,
// } from '@/lib/server-actions/product'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '../ui/dialog'

// type PropsType = {
//   productId: string
//   maxQuantity?: number
//   initialQuantity: number
//   onQuantityChange?: (quantity: number) => void
//   size?: 'sm' | 'md' | 'lg'
//   showQuickEdit?: boolean
//   className?: string
// }
// type QuantitySize = 'sm' | 'md' | 'lg'

// const sizeConfig: Record<
//   QuantitySize,
//   { wrapper: string; button: string; text: string; icon: number }
// > = {
//   sm: { wrapper: 'p-1', button: 'p-1', text: 'text-sm', icon: 14 },
//   md: { wrapper: 'p-2', button: 'p-2', text: 'text-base', icon: 18 },
//   lg: { wrapper: 'p-3', button: 'p-3', text: 'text-lg', icon: 22 },
// }

// const CartCounter = ({
//   productId,
//   initialQuantity,
//   maxQuantity = 99,
//   onQuantityChange,
//   size = 'sm',
//   showQuickEdit = true,
//   className = '',
// }: PropsType) => {
//   const [quantity, setQuantity] = useState(initialQuantity)
//   const [isLoading, setIsLoading] = useState(false)
//   const [editValue, setEditValue] = useState(initialQuantity.toString())
//   const [isDialogOpen, setIsDialogOpen] = useState(false)

//   const dispatch = useAppDispatch()
//   const { data: session } = useSession()
//   const { toast } = useToast()

//   const getToastMessage = (oldQty: number, newQty: number) => {
//     if (newQty === 0) {
//       return {
//         title: '🗑️ Removed from cart',
//         description: 'Item removed successfully',
//       }
//     }
//     if (oldQty === 0) {
//       return {
//         title: '🛒 Added to cart',
//         description: 'Item added successfully',
//       }
//     }
//     if (newQty > oldQty) {
//       return {
//         title: '➕ Quantity increased',
//         description: `Updated to ${newQty} items`,
//       }
//     }
//     return {
//       title: '➖ Quantity decreased',
//       description: `Updated to ${newQty} items`,
//     }
//   }

//   // Helper function to sync with localStorage for guest users
//   const syncWithLocalStorage = (newQuantity: number) => {
//     try {
//       const cart = JSON.parse(localStorage.getItem('cart') || '[]')
//       const existingItemIndex = cart.findIndex(
//         (item: any) => item.product?._id === productId
//       )

//       if (newQuantity === 0) {
//         // Remove item completely
//         if (existingItemIndex !== -1) {
//           cart.splice(existingItemIndex, 1)
//         }
//       } else {
//         // Update quantity if item exists
//         if (existingItemIndex !== -1) {
//           cart[existingItemIndex].quantity = newQuantity
//         }
//       }

//       localStorage.setItem('cart', JSON.stringify(cart))
//     } catch (error) {
//       console.error('Error syncing with localStorage:', error)
//     }
//   }

//   // Helper function to calculate the exact server operations needed
//   const calculateServerOperations = (currentQty: number, targetQty: number) => {
//     const operations: Array<{ type: 'add' | 'remove'; quantity: number }> = []

//     if (targetQty === 0) {
//       // Remove all quantities
//       operations.push({ type: 'remove', quantity: currentQty })
//     } else if (targetQty > currentQty) {
//       // Add the difference
//       operations.push({ type: 'add', quantity: targetQty - currentQty })
//     } else if (targetQty < currentQty) {
//       // Remove the difference
//       operations.push({ type: 'remove', quantity: currentQty - targetQty })
//     }

//     return operations
//   }

//   const handleQuantityUpdate = useCallback(
//     async (newQuantity: number) => {
//       if (
//         newQuantity < 0 ||
//         newQuantity > maxQuantity ||
//         newQuantity === quantity
//       )
//         return

//       const oldQuantity = quantity
//       setIsLoading(true)

//       try {
//         // Optimistically update UI
//         setQuantity(newQuantity)
//         onQuantityChange?.(newQuantity)

//         // Update Redux store
//         if (newQuantity === 0) {
//           dispatch(cartActions.removeFromCart({ productId }))
//         } else {
//           dispatch(
//             cartActions.updateCartQuantity({
//               productId,
//               quantity: newQuantity,
//             })
//           )
//         }

//         // Sync with server if user is authenticated
//         if (session?.user) {
//           const operations = calculateServerOperations(oldQuantity, newQuantity)

//           for (const operation of operations) {
//             let response

//             if (operation.type === 'add') {
//               response = await addProductToCart({
//                 productId,
//                 quantity: operation.quantity,
//               })
//             } else {
//               response = await removeProductFromCart({
//                 productId,
//                 quantity: operation.quantity,
//               })
//             }

//             if (response.hasError) {
//               throw new Error(response.message)
//             }
//           }
//         } else {
//           // For guest users, sync with localStorage
//           syncWithLocalStorage(newQuantity)
//         }

//         // Show success toast
//         const toastMessage = getToastMessage(oldQuantity, newQuantity)
//         toast({
//           title: toastMessage.title,
//           description: toastMessage.description,
//           duration: 2000,
//         })
//       } catch (error: any) {
//         console.error('Cart update failed:', error)

//         // Revert optimistic updates
//         setQuantity(oldQuantity)
//         onQuantityChange?.(oldQuantity)

//         // Revert Redux state
//         if (oldQuantity === 0) {
//           dispatch(cartActions.removeFromCart({ productId }))
//         } else {
//           dispatch(
//             cartActions.updateCartQuantity({
//               productId,
//               quantity: oldQuantity,
//             })
//           )
//         }

//         // Revert localStorage for guest users
//         if (!session?.user) {
//           syncWithLocalStorage(oldQuantity)
//         }

//         // Show error toast with specific message
//         toast({
//           title: '❌ Update failed',
//           description:
//             error.message || 'Unable to update cart. Please try again.',
//           variant: 'destructive',
//           duration: 3000,
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [
//       dispatch,
//       maxQuantity,
//       onQuantityChange,
//       productId,
//       quantity,
//       session?.user,
//       toast,
//     ]
//   )

//   // Sync component state with prop changes
//   useEffect(() => {
//     setQuantity(initialQuantity)
//     setEditValue(initialQuantity.toString())
//   }, [initialQuantity])

//   const { wrapper, button, text, icon } = sizeConfig[size]

//   return (
//     <div
//       className={`flex items-center gap-1 bg-[#3bb77e]/10 rounded-full ${wrapper} ${className} ${
//         isLoading ? 'opacity-50 pointer-events-none' : ''
//       }`}
//     >
//       <button
//         onClick={() => handleQuantityUpdate(quantity - 1)}
//         disabled={quantity <= 0 || isLoading}
//         className={`text-[#3bb77e] disabled:opacity-40 hover:bg-[#3bb77e]/20 rounded-full transition-colors ${button}`}
//         aria-label='Decrease quantity'
//       >
//         <BiMinus size={icon} />
//       </button>

//       {showQuickEdit ? (
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <button
//               className={`min-w-[2.5em] font-semibold text-[#3bb77e] hover:bg-[#3bb77e]/20 rounded-full transition-colors px-2 py-1`}
//               disabled={isLoading}
//               aria-label='Edit quantity'
//             >
//               {quantity}
//             </button>
//           </DialogTrigger>
//           <DialogContent className='sm:max-w-[425px]'>
//             <DialogHeader>
//               <DialogTitle>Edit Quantity</DialogTitle>
//             </DialogHeader>
//             <div className='grid gap-4 py-4'>
//               <Input
//                 type='number'
//                 value={editValue}
//                 onChange={(e) => setEditValue(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     const val = parseInt(editValue)
//                     if (!isNaN(val) && val >= 0 && val <= maxQuantity) {
//                       handleQuantityUpdate(val)
//                       setIsDialogOpen(false)
//                     }
//                   }
//                   if (e.key === 'Escape') {
//                     setIsDialogOpen(false)
//                   }
//                 }}
//                 min={0}
//                 max={maxQuantity}
//                 className='text-center focus:outline-none focus:ring-2 focus:ring-[#3bb77e]'
//                 autoFocus
//               />
//               <div className='text-sm text-gray-500 text-center'>
//                 Max quantity: {maxQuantity}
//               </div>
//               <div className='flex justify-end gap-2'>
//                 <Button
//                   variant='bordered'
//                   onClick={() => {
//                     setEditValue(quantity.toString())
//                     setIsDialogOpen(false)
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     const val = parseInt(editValue)
//                     if (!isNaN(val) && val >= 0 && val <= maxQuantity) {
//                       handleQuantityUpdate(val)
//                       setIsDialogOpen(false)
//                     } else {
//                       toast({
//                         title: 'Invalid quantity',
//                         description: `Please enter a number between 0 and ${maxQuantity}`,
//                         variant: 'destructive',
//                       })
//                     }
//                   }}
//                   disabled={isLoading}
//                 >
//                   Update
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       ) : (
//         <span
//           className={`min-w-[2.5em] text-center font-semibold text-[#3bb77e] ${text}`}
//         >
//           {quantity}
//         </span>
//       )}

//       <button
//         onClick={() => handleQuantityUpdate(quantity + 1)}
//         disabled={quantity >= maxQuantity || isLoading}
//         className={`text-[#3bb77e] disabled:opacity-40 hover:bg-[#3bb77e]/20 rounded-full transition-colors ${button}`}
//         aria-label='Increase quantity'
//       >
//         <BiPlus size={icon} />
//       </button>
//     </div>
//   )
// }

// export default CartCounter

// import { useState, useCallback, useEffect } from 'react'
// import { BiMinus, BiPlus } from 'react-icons/bi'
// import { Button, Input } from '@nextui-org/react'
// import { useSession } from 'next-auth/react'
// import { useToast } from '@/hooks/use-toast'
// import { useAppDispatch } from '@/redux-store/hooks'
// import { cartActions } from '@/redux-store/store-slices/CartSlice'
// import {
//   addProductToCart,
//   removeProductFromCart,
// } from '@/lib/server-actions/product'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '../ui/dialog'

// type PropsType = {
//   productId: string
//   maxQuantity?: number
//   initialQuantity: number
//   onQuantityChange?: (quantity: number) => void
//   size?: 'sm' | 'md' | 'lg'
//   showQuickEdit?: boolean
//   className?: string
// }
// type QuantitySize = 'sm' | 'md' | 'lg'

// const sizeConfig: Record<
//   QuantitySize,
//   { wrapper: string; button: string; text: string; icon: number }
// > = {
//   sm: { wrapper: 'p-1', button: 'p-1', text: 'text-sm', icon: 14 },
//   md: { wrapper: 'p-2', button: 'p-2', text: 'text-base', icon: 18 },
//   lg: { wrapper: 'p-3', button: 'p-3', text: 'text-lg', icon: 22 },
// }

// const CartCounter = ({
//   productId,
//   initialQuantity,
//   maxQuantity = 99,
//   onQuantityChange,
//   size = 'sm',
//   showQuickEdit = true,
//   className = '',
// }: PropsType) => {
//   const [quantity, setQuantity] = useState(initialQuantity)
//   const [isLoading, setIsLoading] = useState(false)
//   const [editValue, setEditValue] = useState(initialQuantity.toString())
//   const [isDialogOpen, setIsDialogOpen] = useState(false)

//   const dispatch = useAppDispatch()
//   const { data: session } = useSession()
//   const { toast } = useToast()

//   const getToastMessage = (oldQty: number, newQty: number) => {
//     if (newQty === 0) {
//       return {
//         title: '🗑️ Removed from cart',
//         description: 'Item removed successfully',
//       }
//     }
//     if (oldQty === 0) {
//       return {
//         title: '🛒 Added to cart',
//         description: 'Item added successfully',
//       }
//     }
//     if (newQty > oldQty) {
//       return {
//         title: '➕ Quantity increased',
//         description: `Updated to ${newQty} items`,
//       }
//     }
//     return {
//       title: '➖ Quantity decreased',
//       description: `Updated to ${newQty} items`,
//     }
//   }

//   // Helper function to sync with localStorage for guest users ONLY
//   const syncWithLocalStorage = (newQuantity: number) => {
//     // IMPORTANT: Only sync with localStorage if user is NOT logged in
//     if (session?.user) {
//       return // Don't touch localStorage for authenticated users
//     }

//     try {
//       const cart = JSON.parse(localStorage.getItem('cart') || '[]')
//       const existingItemIndex = cart.findIndex(
//         (item: any) => item.product?._id === productId
//       )

//       if (newQuantity === 0) {
//         // Remove item completely
//         if (existingItemIndex !== -1) {
//           cart.splice(existingItemIndex, 1)
//         }
//       } else {
//         // Update quantity if item exists
//         if (existingItemIndex !== -1) {
//           cart[existingItemIndex].quantity = newQuantity
//         }
//       }

//       localStorage.setItem('cart', JSON.stringify(cart))
//     } catch (error) {
//       console.error('Error syncing with localStorage:', error)
//     }
//   }

//   // Helper function to calculate the exact server operations needed
//   const calculateServerOperations = (currentQty: number, targetQty: number) => {
//     const operations: Array<{ type: 'add' | 'remove'; quantity: number }> = []

//     if (targetQty === 0) {
//       // Remove all quantities
//       operations.push({ type: 'remove', quantity: currentQty })
//     } else if (targetQty > currentQty) {
//       // Add the difference
//       operations.push({ type: 'add', quantity: targetQty - currentQty })
//     } else if (targetQty < currentQty) {
//       // Remove the difference
//       operations.push({ type: 'remove', quantity: currentQty - targetQty })
//     }

//     return operations
//   }

//   const handleQuantityUpdate = useCallback(
//     async (newQuantity: number) => {
//       if (
//         newQuantity < 0 ||
//         newQuantity > maxQuantity ||
//         newQuantity === quantity
//       )
//         return

//       const oldQuantity = quantity
//       setIsLoading(true)

//       try {
//         // Optimistically update UI
//         setQuantity(newQuantity)
//         onQuantityChange?.(newQuantity)

//         // Update Redux store
//         if (newQuantity === 0) {
//           dispatch(cartActions.removeFromCart({ productId }))
//         } else {
//           dispatch(
//             cartActions.updateCartQuantity({
//               productId,
//               quantity: newQuantity,
//             })
//           )
//         }

//         // Sync with server if user is authenticated
//         if (session?.user) {
//           const operations = calculateServerOperations(oldQuantity, newQuantity)

//           for (const operation of operations) {
//             let response

//             if (operation.type === 'add') {
//               response = await addProductToCart({
//                 productId,
//                 quantity: operation.quantity,
//               })
//             } else {
//               response = await removeProductFromCart({
//                 productId,
//                 quantity: operation.quantity,
//               })
//             }

//             if (response.hasError) {
//               throw new Error(response.message)
//             }
//           }

//           // IMPORTANT: Clear localStorage after successful server sync
//           // This prevents conflicts when user logs out and back in
//           try {
//             localStorage.removeItem('cart')
//           } catch (error) {
//             console.warn('Could not clear localStorage:', error)
//           }
//         } else {
//           // For guest users, sync with localStorage
//           syncWithLocalStorage(newQuantity)
//         }

//         // Show success toast
//         const toastMessage = getToastMessage(oldQuantity, newQuantity)
//         toast({
//           title: toastMessage.title,
//           description: toastMessage.description,
//           duration: 2000,
//         })
//       } catch (error: any) {
//         console.error('Cart update failed:', error)

//         // Revert optimistic updates
//         setQuantity(oldQuantity)
//         onQuantityChange?.(oldQuantity)

//         // Revert Redux state
//         if (oldQuantity === 0) {
//           dispatch(cartActions.removeFromCart({ productId }))
//         } else {
//           dispatch(
//             cartActions.updateCartQuantity({
//               productId,
//               quantity: oldQuantity,
//             })
//           )
//         }

//         // Revert localStorage for guest users only
//         if (!session?.user) {
//           syncWithLocalStorage(oldQuantity)
//         }

//         // Show error toast with specific message
//         toast({
//           title: '❌ Update failed',
//           description:
//             error.message || 'Unable to update cart. Please try again.',
//           variant: 'destructive',
//           duration: 3000,
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [
//       dispatch,
//       maxQuantity,
//       onQuantityChange,
//       productId,
//       quantity,
//       session?.user,
//       toast,
//     ]
//   )

//   // Sync component state with prop changes
//   useEffect(() => {
//     setQuantity(initialQuantity)
//     setEditValue(initialQuantity.toString())
//   }, [initialQuantity])

//   const { wrapper, button, text, icon } = sizeConfig[size]

//   return (
//     <div
//       className={`flex items-center gap-1 bg-[#3bb77e]/10 rounded-full ${wrapper} ${className} ${
//         isLoading ? 'opacity-50 pointer-events-none' : ''
//       }`}
//     >
//       <button
//         onClick={() => handleQuantityUpdate(quantity - 1)}
//         disabled={quantity <= 0 || isLoading}
//         className={`text-[#3bb77e] disabled:opacity-40 hover:bg-[#3bb77e]/20 rounded-full transition-colors ${button}`}
//         aria-label='Decrease quantity'
//       >
//         <BiMinus size={icon} />
//       </button>

//       {showQuickEdit ? (
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <button
//               className={`min-w-[2.5em] font-semibold text-[#3bb77e] hover:bg-[#3bb77e]/20 rounded-full transition-colors px-2 py-1`}
//               disabled={isLoading}
//               aria-label='Edit quantity'
//             >
//               {quantity}
//             </button>
//           </DialogTrigger>
//           <DialogContent className='sm:max-w-[425px]'>
//             <DialogHeader>
//               <DialogTitle>Edit Quantity</DialogTitle>
//             </DialogHeader>
//             <div className='grid gap-4 py-4'>
//               <Input
//                 type='number'
//                 value={editValue}
//                 onChange={(e) => setEditValue(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     const val = parseInt(editValue)
//                     if (!isNaN(val) && val >= 0 && val <= maxQuantity) {
//                       handleQuantityUpdate(val)
//                       setIsDialogOpen(false)
//                     }
//                   }
//                   if (e.key === 'Escape') {
//                     setIsDialogOpen(false)
//                   }
//                 }}
//                 min={0}
//                 max={maxQuantity}
//                 className='text-center focus:outline-none focus:ring-2 focus:ring-[#3bb77e]'
//                 autoFocus
//               />
//               <div className='text-sm text-gray-500 text-center'>
//                 Max quantity: {maxQuantity}
//               </div>
//               <div className='flex justify-end gap-2'>
//                 <Button
//                   variant='bordered'
//                   onClick={() => {
//                     setEditValue(quantity.toString())
//                     setIsDialogOpen(false)
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     const val = parseInt(editValue)
//                     if (!isNaN(val) && val >= 0 && val <= maxQuantity) {
//                       handleQuantityUpdate(val)
//                       setIsDialogOpen(false)
//                     } else {
//                       toast({
//                         title: 'Invalid quantity',
//                         description: `Please enter a number between 0 and ${maxQuantity}`,
//                         variant: 'destructive',
//                       })
//                     }
//                   }}
//                   disabled={isLoading}
//                 >
//                   Update
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       ) : (
//         <span
//           className={`min-w-[2.5em] text-center font-semibold text-[#3bb77e] ${text}`}
//         >
//           {quantity}
//         </span>
//       )}

//       <button
//         onClick={() => handleQuantityUpdate(quantity + 1)}
//         disabled={quantity >= maxQuantity || isLoading}
//         className={`text-[#3bb77e] disabled:opacity-40 hover:bg-[#3bb77e]/20 rounded-full transition-colors ${button}`}
//         aria-label='Increase quantity'
//       >
//         <BiPlus size={icon} />
//       </button>
//     </div>
//   )
// }

// export default CartCounter

import { useState, useCallback, useEffect } from 'react'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { Button, Input } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { useAppDispatch } from '@/redux-store/hooks'
import { cartActions } from '@/redux-store/store-slices/CartSlice'
import {
  addProductToCart,
  removeProductFromCart,
} from '@/lib/server-actions/product'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

type PropsType = {
  productId: string
  maxQuantity?: number
  initialQuantity: number
  onQuantityChange?: (quantity: number) => void
  size?: 'sm' | 'md' | 'lg'
  showQuickEdit?: boolean
  className?: string
}
type QuantitySize = 'sm' | 'md' | 'lg'

const sizeConfig: Record<
  QuantitySize,
  { wrapper: string; button: string; text: string; icon: number }
> = {
  sm: { wrapper: 'p-1', button: 'p-1', text: 'text-sm', icon: 14 },
  md: { wrapper: 'p-2', button: 'p-2', text: 'text-base', icon: 18 },
  lg: { wrapper: 'p-3', button: 'p-3', text: 'text-lg', icon: 22 },
}

const CartCounter = ({
  productId,
  initialQuantity,
  maxQuantity = 99,
  onQuantityChange,
  size = 'sm',
  showQuickEdit = true,
  className = '',
}: PropsType) => {
  const [quantity, setQuantity] = useState(initialQuantity)
  const [isLoading, setIsLoading] = useState(false)
  const [editValue, setEditValue] = useState(initialQuantity.toString())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const { toast } = useToast()

  const getToastMessage = (oldQty: number, newQty: number) => {
    if (newQty === 0) {
      return {
        title: 'Removed from cart',
        description: 'Item removed successfully',
      }
    }
    if (oldQty === 0) {
      return {
        title: 'Added to cart',
        description: 'Item added successfully',
      }
    }
    if (newQty > oldQty) {
      return {
        title: '➕ Quantity increased',
        description: `Updated to ${newQty} items`,
      }
    }
    return {
      title: '➖ Quantity decreased',
      description: `Updated to ${newQty} items`,
    }
  }

  const handleQuantityUpdate = useCallback(
    async (newQuantity: number) => {
      if (
        newQuantity < 0 ||
        newQuantity > maxQuantity ||
        newQuantity === quantity
      )
        return

      const oldQuantity = quantity
      setIsLoading(true)

      try {
        // Optimistically update UI
        setQuantity(newQuantity)
        onQuantityChange?.(newQuantity)

        // Update Redux store first
        if (newQuantity === 0) {
          dispatch(cartActions.removeFromCart({ productId }))
        } else {
          dispatch(
            cartActions.updateCartQuantity({
              productId,
              quantity: newQuantity,
            })
          )
        }

        // Sync with localStorage for guest users
        if (!session?.user) {
          dispatch(cartActions.syncWithLocalStorage())
        }

        // Sync with server if user is authenticated
        if (session?.user) {
          let response

          if (newQuantity === 0) {
            //  Remove the entire product from cart
            response = await removeProductFromCart({
              productId,
              quantity: oldQuantity, // Remove all remaining quantity
            })
          } else if (oldQuantity === 0) {
            // Adding new item
            response = await addProductToCart({
              productId,
              quantity: newQuantity,
            })
          } else {
            // Handle quantity updates properly
            const quantityDifference = newQuantity - oldQuantity

            if (quantityDifference > 0) {
              // Increase quantity
              response = await addProductToCart({
                productId,
                quantity: quantityDifference,
              })
            } else {
              // Decrease quantity
              response = await removeProductFromCart({
                productId,
                quantity: Math.abs(quantityDifference),
              })
            }
          }

          if (response?.hasError) {
            throw new Error(response.message)
          }

          // Verify server state after update
          console.log(
            `Cart update successful for ${productId}: ${oldQuantity} → ${newQuantity}`
          )
        }

        // Show success toast
        const toastMessage = getToastMessage(oldQuantity, newQuantity)
        toast({
          title: toastMessage.title,
          description: toastMessage.description,
          duration: 2000,
        })
      } catch (error: any) {
        console.error('Cart update failed:', error)

        // Revert optimistic updates
        setQuantity(oldQuantity)
        onQuantityChange?.(oldQuantity)

        // Revert Redux state
        if (oldQuantity === 0) {
          dispatch(cartActions.removeFromCart({ productId }))
        } else {
          dispatch(
            cartActions.updateCartQuantity({
              productId,
              quantity: oldQuantity,
            })
          )
        }

        // Revert localStorage for guests
        if (!session?.user) {
          dispatch(cartActions.syncWithLocalStorage())
        }

        // Show error toast with specific message
        toast({
          title: 'Update failed',
          description:
            error.message || 'Unable to update cart. Please try again.',
          variant: 'destructive',
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [
      dispatch,
      maxQuantity,
      onQuantityChange,
      productId,
      quantity,
      session?.user,
      toast,
    ]
  )

  // Sync component state with prop changes
  useEffect(() => {
    setQuantity(initialQuantity)
    setEditValue(initialQuantity.toString())
  }, [initialQuantity])

  const { wrapper, button, text, icon } = sizeConfig[size]

  return (
    <div
      className={`flex items-center gap-1 bg-[#3bb77e]/10 rounded-full ${wrapper} ${className} ${
        isLoading ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <button
        onClick={() => handleQuantityUpdate(quantity - 1)}
        disabled={quantity <= 0 || isLoading}
        className={`text-[#3bb77e] disabled:opacity-40 hover:bg-[#3bb77e]/20 rounded-full transition-colors ${button}`}
        aria-label='Decrease quantity'
      >
        <BiMinus size={icon} />
      </button>

      {showQuickEdit ? (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              className={`min-w-[2.5em] font-semibold text-[#3bb77e] hover:bg-[#3bb77e]/20 rounded-full transition-colors px-2 py-1`}
              disabled={isLoading}
              aria-label='Edit quantity'
            >
              {quantity}
            </button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Edit Quantity</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <Input
                type='number'
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = parseInt(editValue)
                    if (!isNaN(val) && val >= 0 && val <= maxQuantity) {
                      handleQuantityUpdate(val)
                      setIsDialogOpen(false)
                    }
                  }
                  if (e.key === 'Escape') {
                    setIsDialogOpen(false)
                  }
                }}
                min={0}
                max={maxQuantity}
                className='text-center focus:outline-none focus:ring-2 focus:ring-[#3bb77e]'
                autoFocus
              />
              <div className='text-sm text-gray-500 text-center'>
                Max quantity: {maxQuantity}
              </div>
              <div className='flex justify-end gap-2'>
                <Button
                  variant='bordered'
                  onClick={() => {
                    setEditValue(quantity.toString())
                    setIsDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const val = parseInt(editValue)
                    if (!isNaN(val) && val >= 0 && val <= maxQuantity) {
                      handleQuantityUpdate(val)
                      setIsDialogOpen(false)
                    } else {
                      toast({
                        title: 'Invalid quantity',
                        description: `Please enter a number between 0 and ${maxQuantity}`,
                        variant: 'destructive',
                      })
                    }
                  }}
                  disabled={isLoading}
                >
                  Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <span
          className={`min-w-[2.5em] text-center font-semibold text-[#3bb77e] ${text}`}
        >
          {quantity}
        </span>
      )}

      <button
        onClick={() => handleQuantityUpdate(quantity + 1)}
        disabled={quantity >= maxQuantity || isLoading}
        className={`text-[#3bb77e] disabled:opacity-40 hover:bg-[#3bb77e]/20 rounded-full transition-colors ${button}`}
        aria-label='Increase quantity'
      >
        <BiPlus size={icon} />
      </button>
    </div>
  )
}

export default CartCounter
