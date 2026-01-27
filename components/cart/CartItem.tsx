// import React from 'react';
// import { CartItem } from '@/types';
// import Button from '@/components/ui/Button';

// interface CartItemProps {
//   cartItem: CartItem;
//   onUpdateQuantity: (itemId: string, quantity: number) => void;
//   onRemove: (itemId: string) => void;
// }

// const CartItemComponent: React.FC<CartItemProps> = ({
//   cartItem,
//   onUpdateQuantity,
//   onRemove
// }) => {
//   const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newQuantity = parseInt(e.target.value);
//     onUpdateQuantity(cartItem.id, newQuantity);
//   };

//   return (
//     <li className="py-6 flex">
//       <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
//         {cartItem.product?.images && cartItem.product.images.length > 0 ? (
//           <img
//             src={cartItem.product.images[0]}
//             alt={cartItem.product.name}
//             className="w-full h-full object-center object-cover"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//             <span className="text-xs text-gray-500">No image</span>
//           </div>
//         )}
//       </div>

//       <div className="ml-4 flex-1 flex flex-col">
//         <div>
//           <div className="flex justify-between text-base font-medium text-gray-900">
//             <h3>{cartItem.product?.name}</h3>
//             <p className="ml-4">${(cartItem.priceAtTime / 100).toFixed(2)}</p>
//           </div>
//           <p className="mt-1 text-sm text-gray-500">
//             {cartItem.selectedSize}, {cartItem.selectedColor}
//           </p>
//         </div>
//         <div className="flex-1 flex items-end justify-between text-sm">
//           <div className="flex items-center">
//             <label htmlFor={`quantity-${cartItem.id}`} className="mr-2 text-sm font-medium text-gray-700">
//               Qty
//             </label>
//             <select
//               id={`quantity-${cartItem.id}`}
//               name={`quantity-${cartItem.id}`}
//               value={cartItem.quantity}
//               onChange={handleQuantityChange}
//               className="max-w-full rounded-md border border-gray-300 py-1 pl-2 pr-7 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
//             >
//               {[...Array(Math.min(10, cartItem.product?.inStock || 10)).keys()].map((num) => (
//                 <option key={num + 1} value={num + 1}>
//                   {num + 1}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex">
//             <button
//               type="button"
//               className="font-medium text-red-600 hover:text-red-500"
//               onClick={() => onRemove(cartItem.id)}
//             >
//               Remove
//             </button>
//           </div>
//         </div>
//       </div>
//     </li>
//   );
// };

// export default CartItemComponent;

'use client';

import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/lib/context/cart-context';

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 border rounded-lg p-4 bg-white">
      <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden border">
        {item.product?.images?.[0] ? (
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-medium">{item.product?.name}</h3>
        <p className="text-sm text-gray-500">
          Size: {item.selectedSize} | Color: {item.selectedColor}
        </p>

        <div className="flex items-center justify-between mt-3">
          <select
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {Array.from({ length: Math.min(10, item.product?.inStock || 10) }).map(
              (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              )
            )}
          </select>

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="font-semibold">
        ${((item.priceAtTime * item.quantity) / 100).toFixed(2)}
      </div>
    </div>
  );
}
