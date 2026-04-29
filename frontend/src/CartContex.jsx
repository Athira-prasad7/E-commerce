import { Children, createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ Children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        const existing = cartItems.find((item) => item.id === product.id);
        if (existing) {
            setCartItems(
                cartItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item

                )
            );
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const romoveFromCart = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };


    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        setCartItems(
            cartItems.map((item) =>
                item.id === id ? { ...item, quantity } : item)
        );
    };

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, romoveFromCart, updateQuantity }}>
            {Children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(createContext);