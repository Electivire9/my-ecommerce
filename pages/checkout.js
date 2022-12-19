import { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { ProductsContext } from "../components/ProductsContext";

export default function CheckoutPage() {
    const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);
    const [productsInfos, setProductsInfos] = useState([]);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const uniqIds = [...new Set(selectedProducts)];
        fetch('/api/products?ids=' + uniqIds.join(','))
            .then(response => response.json())
            .then(json => setProductsInfos(json));
    }, [selectedProducts]);

    function moreOfThisProduct(id) {
        setSelectedProducts(prev => [...prev, id])
    }

    function lessOfThisProduct(id) {
        const pos = selectedProducts.indexOf(id);
        if (pos !== -1) {
            setSelectedProducts(prev => {
                return prev.filter((value, index) => index != pos);
            });
        }
    }

    const deliveryPrice = (5).toFixed(2);
    let subtotal = 0;
    if (selectedProducts.length > 0) {
        for (let id of selectedProducts) {
            const price = productsInfos.find(p => p._id === id)?.price || 0;
            subtotal += price;
        }
    }
    subtotal = subtotal.toFixed(2);
    const tax = ((parseFloat(subtotal) + parseFloat(deliveryPrice)) * 0.15).toFixed(2);
    const total = (parseFloat(subtotal) + parseFloat(deliveryPrice) + parseFloat(tax)).toFixed(2);
    

    return (
        <Layout>
            {/* ------------------ Order Info ------------------ */}
            {!productsInfos.length && (
                <div>no products</div>
            )}
            {productsInfos.length && productsInfos.map(productInfo => {
                const amount = selectedProducts.filter(id => id === productInfo._id).length;
                if (amount === 0) return; 
                return (
                <div className="flex mb-5" key={productInfo._id}>
                    <div className="bg-gray-100 p-3 rounded-xl shrink-0">
                        <img className="w-24" src={productInfo.picture} alt='' />
                    </div>
                    <div className="pl-4">
                        <h3 className="font-bold text-lg">{productInfo.name}</h3>
                        <p className="text-sm leading-4 text-gray-500">{productInfo.description}</p>
                        <div className="flex">
                            <div className="grow">${productInfo.price}</div>
                            <div>
                                <button onClick={() => lessOfThisProduct(productInfo._id)} className="border border-emerald-500 px-2 rounded-lg text-emerald-500">-</button>
                                <span className="px-2">
                                    {selectedProducts.filter(id => id === productInfo._id).length}
                                </span>
                                <button onClick={() => moreOfThisProduct(productInfo._id)} className="bg-emerald-500 px-2 rounded-lg text-white">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            )})}

            <form action="/api/checkout" method="POST">
                {/* ------------------ Customer Info ------------------ */}
                <div className="mt-4">
                    <input name="name" value={name} onChange={e => setName(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="Name" />
                    <input name="address" value={address} onChange={e => setAddress(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="Address" />
                    <input name="city" value={city} onChange={e => setCity(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="City & Postal Code" />
                    <input name="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="email" placeholder="Email" />
                </div>

                {/* ------------------ Price Info ------------------- */}
                <div className="mt-4">
                    <div className="flex my-2">
                        <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
                        <h3 className="font-bold">${subtotal}</h3>
                    </div>
                    <div className="flex my-2">
                        <h3 className="grow font-bold text-gray-400">Delivery:</h3>
                        <h3 className="font-bold">${deliveryPrice}</h3>
                    </div>
                    <div className="flex my-2">
                        <h3 className="grow font-bold text-gray-400">Tax(15%):</h3>
                        <h3 className="font-bold">${tax}</h3>
                    </div>
                    <div className="flex my-2 border-t pt-2 border-dashed border-emerald-500">
                        <h3 className="grow font-bold text-gray-400">Total:</h3>
                        <h3 className="font-bold">${total}</h3>
                    </div>
                </div>
                <input type="hidden" name="products" value={selectedProducts.join(',')} />
                <button type="submit" className="bg-emerald-500 px-5 py-2 rounded-xl text-white font-bold w-full my-4 shadow-emerald-300 shadow-lg">Pay ${total}</button>
            </form>
        </Layout>
    )
}