import { createContext, useContext, useState, useEffect, createRef } from "react";
import { authFetch, getAccessToken } from "../utils/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);


    const fetchCart = async () => {
        try {
            const res = await authFetch(`http://127.0.0.1:8000/cart/`)
            const data = await res.json();
            setCartItems(data.items || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

     const addToCart = async (productId) => {
        try{
            await authFetch(`http://127.0.0.1:8000/cart/add/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ product_id: productId }),
            });
            fetchCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    const removeFromCart = async (itemId) => {
        try {
            await authFetch('http://127.0.0.1:8000/cart/remove/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id: itemId }),
            });
            fetchCart();
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    }

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) {
            await removeFromCart(itemId);
            return;
        }
        try {
            await authFetch('http://127.0.0.1:8000/cart/update/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id: itemId, quantity }),
            });
            fetchCart();
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    }

    const clearCart = () => {
        setCartItems([]);
        setTotal(0);
    }
    return (
        <CartContext.Provider
            value={{ cartItems, total, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);