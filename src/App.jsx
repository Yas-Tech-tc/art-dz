import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminProducts from "./pages/AdminProducts";
import { selectToken, setCredentials } from "./store/authSlice";
import { useGetMeQuery } from "./api/api";

function App() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const { data: me } = useGetMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (me && token) {
      dispatch(setCredentials({ token, user: me }));
    }
  }, [me, token, dispatch]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/boutique" element={<Shop />} />
        <Route path="/produit/:id" element={<ProductDetail />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/favoris" element={<Favorites />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
        <Route
          path="/admin/produits"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
