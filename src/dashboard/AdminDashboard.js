import { useEffect, useState, useContext } from 'react';
import './dashboard.css';
import { Modal } from '../modal/modal';
import { useNavigate, redirect } from 'react-router-dom';
import { api, cookies } from '../api';
import { AuthContext } from '../AdminLogin/AuthContext';

export function AdminDashBoard() {
    const { isAuthenticated, login, logout } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        brand: '',
        price: '',
        imageUrl: ''
    });
    const [currentProductId, setCurrentProductId] = useState(null);
    const navigate = useNavigate();

    function handleModal() {
        setIsModalOpen(true);
    }

    function handleModalClose() {
        setIsModalOpen(false);
        setIsEditMode(false);
        setFormData({
            name: '',
            description: '',
            category: '',
            brand: '',
            price: '',
            imageUrl: ''
        });
    }

    function handleChange(e) {
        let { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                imageUrl: file,
            }));
        }
    };

    function handleSubmit(e) {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    const url = isEditMode ? `/product/product/${currentProductId}` : '/product/add';
    
    const request = isEditMode ? api.put : api.post;

    request(url, formData)
        .then((res) => {
            console.log("Product saved:", res.data);
            setProducts((prevProducts) => {
                if (isEditMode) {
                    return prevProducts.map((product) =>
                        product._id === currentProductId ? res.data : product
                    );
                }
                return [...prevProducts, res.data];
            });
            setIsModalOpen(false);
            setIsEditMode(false);
            setFormData({
                name: '',
                description: '',
                category: '',
                brand: '',
                price: '',
                imageUrl: ''
            });
        })
        .catch((err) => {
            console.log("Error saving product:", err);
        });
}

    function handleEdit(product) {
        setCurrentProductId(product._id);
        setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            brand: product.brand,
            price: product.price,
            imageUrl: product.imageUrl
        });
        setIsEditMode(true);
        setIsModalOpen(true);
    }

    function handleLogout() {
        logout()
        cookies.remove('TOKEN')
        navigate('/admin');
    }

    useEffect(() => {
        let url = '/product';
        api.get(url)
            .then((res) => {
                console.log("Data: ", res.data);
                setProducts(res.data);
            })
            .catch((err) => {
                console.log("Error fetching products", err);
                if (err.response && err.response.status === 401) {
                    navigate('/admin');
                }
            });
    }, [navigate]);

    return (
        <div className='dashboard'>
            <nav className="navbar">
                <div className="navbar-brand">PRODUCT ADMIN</div>
                <div className="navbar-menu">
                    <div className="navbar-item" onClick={handleModal}>Add Product</div>
                    <div className="navbar-item" onClick={handleLogout}>Logout</div>
                </div>
            </nav>
            <div className='contents'>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>{product.price}</td>
                                <td><img src={product.imageUrl} alt={product.name} className="product-image" /></td>
                                <td>
                                    <button onClick={() => handleEdit(product)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal open={isModalOpen} onClose={handleModalClose}>
                <h2>{isEditMode ? 'Edit Product' : 'Add Product'}</h2>
                <form className='form' onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    <div>
                        <label>Category:</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Brand:</label>
                        <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Image URL:</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="Enter image URL"
                        />
                    </div>
                    <button type="submit">{isEditMode ? 'Save Changes' : 'Add Product'}</button>
                </form>
            </Modal>
        </div>
    );
}
