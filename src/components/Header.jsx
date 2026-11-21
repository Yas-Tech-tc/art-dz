import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "./Container";
import { selectCartCount } from "../store/cartSlice";
import {
  logout,
  selectCurrentUser,
  selectIsAdmin,
  selectIsAuthenticated,
} from "../store/authSlice";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/boutique", label: "Boutique" },
  { to: "/favoris", label: "Favoris" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = useSelector(selectCartCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);

  const linkClass = ({ isActive }) =>
    `py-2 font-medium hover:text-terracotta ${isActive ? "text-terracotta" : ""}`;

  function handleLogout() {
    dispatch(logout());
    setOpen(false);
    navigate("/");
  }

  const navLinks = [
    ...links,
    ...(isAdmin ? [{ to: "/admin/produits", label: "Gestion des produits" }] : []),
  ];

  const items = navLinks.map((l) => (
    <NavLink key={l.to} to={l.to} end className={linkClass} onClick={() => setOpen(false)}>
      {l.label}
    </NavLink>
  ));

  return (
    <header className="sticky top-0 z-10 border-b border-night/10 bg-cream">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="font-display text-xl">
            Art <span className="text-terracotta">DZ</span>
          </Link>

          <nav className="hidden gap-6 md:flex">{items}</nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="hidden items-center gap-3 md:flex">
                <span className="text-sm font-medium text-night/80">
                  Bonjour, <strong>{user?.name || "Client"}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer text-sm font-bold text-terracotta hover:underline"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                to="/connexion"
                className="hidden text-sm font-bold hover:text-terracotta md:inline-block"
              >
                Connexion
              </Link>
            )}

            <Link
              to="/panier"
              className="flex min-h-11 items-center rounded-full border-2 border-night px-4 font-bold hover:bg-night hover:text-cream"
            >
              Panier · {cartCount}
            </Link>

            <button
              className="flex h-11 w-11 items-center justify-center text-2xl md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {open && (
          <nav className="flex flex-col border-t border-night/10 pb-4 pt-2 md:hidden">
            {items}
            <div className="mt-2 border-t border-night/10 pt-2">
              {isAuthenticated ? (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">
                    {user?.name || "Client"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer text-sm font-bold text-terracotta"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  to="/connexion"
                  onClick={() => setOpen(false)}
                  className="block py-2 font-bold text-terracotta"
                >
                  Connexion
                </Link>
              )}
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}

export default Header;
