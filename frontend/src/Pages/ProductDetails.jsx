import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../content/CartContext";

function ProductDetails() {
    const { id } = useParams();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`${BASEURL}/products/${id}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch product details");
                }
                return response.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!product) {
        return <div>No product found</div>;
    }

    const handleAddToCart = () => {
        if (!localStorage.getItem('access_token')) {
            window.location.href = '/login';
            return;
        }
        addToCart(product.id);
    }
    // className="bg-blue-600 text-white px-4 py-2  rounded-lg hover:bg-blue-700 transition"
    return (
        <div className="min-h-screen bg-gray-100 flex py-40 pl-50">
            <div className="max-w-3xl w-full">
                <div className="flex flex-col md:flex-row gap-8">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full md:w-1/2 h-auto object-cover rounded-lg"
                    />
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-800 p-5">{product.name}</h1>
                        <p className="text-xl text-gray-600 font-semibold p-5">${product.price}</p>
                        <p className="text-gray-700 leading-relaxed p-5">{product.description}</p>
                        <button onClick={handleAddToCart} className="border bg-blue-400 text-gray-800 px-5 py-2 ml-5 w-fit hover:bg-gray-100 transition">
                            Add to Cart 🛒
                        </button>
                        <div className="mt-4">
                            <a href="/" className="text-blue-600 hover:underline px-5">
                                &larr; Back to Home
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
