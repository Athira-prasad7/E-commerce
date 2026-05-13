import { Children, createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);


    const fetchCart = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/cart/`)
            if (!res.ok) {
                throw new Error("Failed to fetch cart");
            }
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


    const addToCart = async (product) => {
        try {
            await fetch(`http://127.0.0.1:8000/cart/add/`, {
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
            await fetch('http://127.0.0.1:8000/cart/remove/', {
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
            await fetch('http://127.0.0.1:8000/cart/update/', {
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